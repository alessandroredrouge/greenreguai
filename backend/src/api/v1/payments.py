import os
from fastapi import APIRouter, Request, HTTPException
import stripe
from ...services.supabase import supabase_service

router = APIRouter(tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata']['user_id']
        pack_type = session['metadata']['pack_type']
        stripe_payment_id = session['id']

        credits_to_add = 0
        if pack_type == "Starter Pack":
            credits_to_add = 100
        elif pack_type == "Convenience Pack":
            credits_to_add = 500
        else:
            raise HTTPException(status_code=400, detail="Invalid pack type")

        supabase_service.admin_client.table('credit_transactions').insert({
            'user_id': user_id,
            'credits_amount': credits_to_add,
            'transaction_type': 'purchase',
            'description': f'{pack_type} Purchase',
            'stripe_payment_id': stripe_payment_id,
            'status': 'completed'
        }).execute()

    return {"status": "success"} 