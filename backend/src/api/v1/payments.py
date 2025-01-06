import os
from fastapi import APIRouter, Request, HTTPException
import stripe
from ...services.supabase import supabase_service
from fastapi.responses import JSONResponse

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
        return JSONResponse(status_code=400, content={"detail": "Invalid payload. Contact support at greenreguai@outlook.com."})
    except stripe.error.SignatureVerificationError:
        return JSONResponse(status_code=400, content={"detail": "Invalid signature. Contact support at greenreguai@outlook.com."})

    try:
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            email = session['customer_details'].get('email')
            payment_link = session.get('payment_link')
            payment_status = session.get('payment_status')

            if not email:
                return JSONResponse(status_code=400, content={"detail": "Email not found. Contact support at greenreguai@outlook.com."})

            # Fetch user_id from Supabase using email
            user_response = supabase_service.client.from_('user_profiles').select('user_id').eq('email', email).single().execute()
            user_data = user_response.data
            if not user_data:
                return JSONResponse(status_code=400, content={"detail": "User not found. Contact support at greenreguai@outlook.com."})
            
            user_id = user_data['user_id']

            # Determine pack type
            if payment_link == "plink_1Qcgq0B4oMfN7m86VIh7Fvq1":
                pack_type = "Starter Pack"
                credits_to_add = 100
            elif payment_link == "plink_1QcgtUB4oMfN7m86ZRadYxB9":
                pack_type = "Convenience Pack"
                credits_to_add = 500
            else:
                return JSONResponse(status_code=400, content={"detail": "Unknown pack. Contact support at greenreguai@outlook.com."})

            # Check payment status
            if payment_status != "paid":
                return JSONResponse(status_code=400, content={"detail": "Payment not successful. Contact support at greenreguai@outlook.com."})

            # Insert transaction into Supabase
            supabase_service.admin_client.table('credit_transactions').insert({
                'user_id': user_id,
                'credits_amount': credits_to_add,
                'transaction_type': 'purchase',
                'description': f'{pack_type} Purchase',
                'stripe_payment_id': session['id'],
                'status': 'completed'
            }).execute()

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Internal server error: {str(e)}. Contact support at greenreguai@outlook.com."})

    return {"status": "success"} 