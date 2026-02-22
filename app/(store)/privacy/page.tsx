"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/utils/animations";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ClientTitle from "@/components/ui/ClientTitle";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-dark flex flex-col">
            <ClientTitle title="سياسة الخصوصية" />
            <Header />

            <div className="flex-grow pt-32 pb-20 container mx-auto px-6 max-w-4xl rtl">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="card-glass p-8 md:p-12"
                >
                    <h1 className="text-4xl font-black text-white mb-8">سياسة الخصوصية</h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">1. مقدمة</h2>
                            <p>
                                نلتزم في تذكرتي بحماية خصوصيتك وبياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدامك لمنصتنا.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">2. المعلومات التي نجمعها</h2>
                            <p>
                                قد نقوم بجمع معلومات شخصية مثل اسمك، عنوان بريدك الإلكتروني، رقم هاتفك، ومعلومات الدفع عند قيامك بالتسجيل أو الشراء عبر منصتنا.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">3. كيف نستخدم معلوماتك</h2>
                            <p>
                                نستخدم المعلومات التي نجمعها لتقديم خدماتنا، تحسين تجربة المستخدم، معالجة المدفوعات، وإرسال التحديثات أو العروض الترويجية في حال موافقتك على ذلك.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">4. حماية البيانات</h2>
                            <p>
                                نتخذ تدابير تقنية وإدارية صارمة لحماية بياناتك من الوصول غير المصرح به، التعديل، أو الإفصاح. نحن نستخدم تقنيات التشفير لضمان أمان معاملاتك.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">5. مشاركة المعلومات</h2>
                            <p>
                                لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. قد نشارك بياناتك فقط مع مزودي الخدمة الموثوقين الذين يساعدوننا في تشغيل المنصة، وذلك بموجب اتفاقيات سرية صارمة.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">6. ملفات تعريف الارتباط (Cookies)</h2>
                            <p>
                                نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتخصيص المحتوى. يمكنك اختيار تعطيل ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">7. حقوقك</h2>
                            <p>
                                لديك الحق في الوصول إلى بياناتك الشخصية، تصحيحها، أو طلب حذفها. للتواصل معنا بخصوص حقوقك، يرجى إرسال طلب من خلال الدعم الفني.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-primary mb-3">8. التعديلات على سياسة الخصوصية</h2>
                            <p>
                                نحتفظ بالحق في تحديث أو تعديل سياسة الخصوصية في أي وقت. سيتم نشر التغييرات على هذه الصفحة، ونشجعك على مراجعتها بشكل دوري.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
