"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/utils/animations";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ClientTitle from "@/components/ui/ClientTitle";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-dark flex flex-col">
            <ClientTitle title="الشروط والأحكام" />
            <Header />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-6 max-w-4xl rtl">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="card-glass p-8 md:p-12"
                >
                    <h1 className="text-4xl font-black text-white mb-8">الشروط والأحكام</h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">1. القبول بالشروط</h2>
                            <p>
                                بدخولك واستخدامك لمنصة تذكرتي، فإنك تقر وتوافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام الموقع.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">2. الخدمات المقدمة</h2>
                            <p>
                                تقدم تذكرتي خدمات بيع تذاكر الفعاليات والمنتجات الرقمية المتنوعة. نحتفظ بالحق في تعديل أو إيقاف أي خدمة دون إشعار مسبق.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">3. الحسابات والتسجيل</h2>
                            <p>
                                لكي تتمكن من الشراء، قد يطلب منك إنشاء حساب. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور، وتتحمل المسؤولية الكاملة عن أي أنشطة تصدر منه.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">4. سياسة الشراء والاسترجاع</h2>
                            <p>
                                جميع المشتريات (تذاكر أو منتجات) تعتبر نهائية ولا يمكن استرجاعها أو استبدالها إلا في حالات استثنائية (مثل إلغاء الفعالية من قبل المنظم). يجب مراجعة تفاصيل كل تذكرة بعناية قبل الدفع.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">5. الاستخدام المقبول</h2>
                            <p>
                                يُحظر استخدام المنصة لأي غرض غير قانوني أو ضار. لا يُسمح بإعادة بيع التذاكر أو استخدامها لأغراض تجارية دون الحصول على موافقة خطية مسبقة من الإدارة.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">6. حقوق الملكية الفكرية</h2>
                            <p>
                                جميع المحتويات الموجودة على تذكرتي، بما في ذلك النصوص، الرسومات، الشعارات، البرمجيات، هي ملكية حصرية للمنصة ومحمية بموجب حقوق النشر.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">7. إخلاء المسؤولية</h2>
                            <p>
                                تقدم الخدمات "كما هي" دون ضمانات من أي نوع. تذكرتي لا تتحمل المسؤولية عن أي أضرار غير مباشرة أو عرضية تنشأ عن استخدام الموقع أو عدم القدرة على استخدامه.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">8. القوانين المعمول بها</h2>
                            <p>
                                تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية. وأي نزاع ينشأ عن استخدام المنصة يكون من اختصاص المحاكم المعنية داخل المملكة.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
