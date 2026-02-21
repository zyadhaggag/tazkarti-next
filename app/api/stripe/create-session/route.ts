import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Note: Stripe Key should be in .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
})

export async function POST(request: Request) {
    try {
        const { itemId, itemName, itemPrice, itemImage, quantity = 1 } = await request.json()
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'sar',
                        product_data: {
                            name: itemName,
                            images: [itemImage],
                        },
                        unit_amount: Math.round(itemPrice * 100), // Stripe uses cents/halalas
                    },
                    quantity,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment?item=${itemId}`,
            metadata: {
                userId: user.id,
                itemId: itemId,
            },
        })

        return NextResponse.json({ id: session.id })
    } catch (error: any) {
        console.error('Stripe Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
