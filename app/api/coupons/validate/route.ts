import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { code, amount } = await request.json()
        const supabase = createClient()

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .limit(1)
            .single()

        if (error || !coupon) {
            return NextResponse.json({ success: false, message: 'الكوبون غير صحيح' }, { status: 404 })
        }

        const now = new Date()
        if (coupon.expires_at && new Date(coupon.expires_at) < now) {
            return NextResponse.json({ success: false, message: 'الكوبون انتهت صلاحيته' }, { status: 400 })
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return NextResponse.json({ success: false, message: 'الكوبون وصل للحد الأقصى للاستخدام' }, { status: 400 })
        }

        let discountAmount = 0
        if (coupon.type === 'percentage') {
            discountAmount = (amount * coupon.value) / 100
        } else {
            discountAmount = coupon.value
        }

        const finalAmount = Math.max(0, amount - discountAmount)

        return NextResponse.json({
            success: true,
            discount: discountAmount,
            finalAmount,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value
        })

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
