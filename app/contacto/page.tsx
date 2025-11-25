import { Phone, Mail, Facebook, Instagram, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Contáctanos
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Estamos aquí para ayudarte con la salud y bienestar de tu mascota.
                    </p>
                </div>

                <div className="mt-12 bg-white shadow sm:rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* FORMULARIO */}
                        <div className="p-6 sm:p-10">
                            <h3 className="text-lg font-medium text-gray-900">Envíanos un mensaje</h3>

                            {/* WHATSAPP OPTIONS */}
                            <div className="mt-6 space-y-8">

                                {/* CONSULTA GENERAL */}
                                <div>
                                    <p className="font-semibold text-gray-800 mb-2">Consulta general</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a
                                            href="https://wa.me/593995398645?text=Hola%20DrPaw%2C%20tengo%20una%20consulta%20sobre%20mi%20mascota."
                                            target="_blank"
                                            className="w-full sm:w-auto text-center py-2 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
                                        >
                                            WhatsApp (Móvil)
                                        </a>
                                        <a
                                            href="https://web.whatsapp.com/send?phone=593995398645&text=Hola%20DrPaw%2C%20tengo%20una%20consulta%20sobre%20mi%20mascota."
                                            target="_blank"
                                            className="w-full sm:w-auto text-center py-2 px-4 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                                        >
                                            WhatsApp Web (PC)
                                        </a>
                                    </div>
                                </div>

                                {/* CITA */}
                                <div>
                                    <p className="font-semibold text-gray-800 mb-2">Pedir cita</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a
                                            href="https://wa.me/593995398645?text=Hola%20DrPaw%2C%20quisiera%20agendar%20una%20cita%20para%20mi%20mascota."
                                            target="_blank"
                                            className="w-full sm:w-auto text-center py-2 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
                                        >
                                            WhatsApp (Móvil)
                                        </a>
                                        <a
                                            href="https://web.whatsapp.com/send?phone=593995398645&text=Hola%20DrPaw%2C%20quisiera%20agendar%20una%20cita%20para%20mi%20mascota."
                                            target="_blank"
                                            className="w-full sm:w-auto text-center py-2 px-4 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                                        >
                                            WhatsApp Web (PC)
                                        </a>
                                    </div>
                                </div>

                                {/* EMERGENCIA */}
                                <div>
                                    <p className="font-semibold text-red-700 mb-2">⚠ Emergencia</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a
                                            href="https://wa.me/593995398645?text=Hola%20DrPaw%2C%20tengo%20una%20emergencia%20con%20mi%20mascota%2C%20por%20favor%20ayuda."
                                            target="_blank"
                                            className="w-full sm:w-auto text-center py-2 px-4 rounded-md bg-red-600 text-white font-medium hover:bg-red-700"
                                        >
                                            WhatsApp (Móvil)
                                        </a>
                                        <a
                                            href="https://web.whatsapp.com/send?phone=593995398645&text=Hola%20DrPaw%2C%20tengo%20una%20emergencia%20con%20mi%20mascota%2C%20por%20favor%20ayuda."
                                            target="_blank"
                                            className="w-full sm:w-auto text-center py-2 px-4 rounded-md bg-red-700 text-white font-medium hover:bg-red-800"
                                        >
                                            WhatsApp Web (PC)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INFO + MAPA */}
                        <div className="bg-gray-100 p-6 sm:p-8 flex flex-col items-center justify-start space-y-6">

                            {/* MAPA MÁS PEQUEÑO */}
                            <div className="w-full flex justify-center">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!4v1764086290294!6m8!1m7!1sxlmExxQi-UvCulORRqd1tA!2m2!1d-0.08449035659170309!2d-78.43360805276531!3f49.6542280937762!4f18.403214162726655!5f0.7820865974627469"
                                    width="100%"
                                    height="250"
                                    style={{ border: "0", borderRadius: "10px" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            {/* INFO */}
                            <div className="text-gray-700 text-sm space-y-4">

                                {/* Dirección */}
                                <div className="flex items-center justify-center space-x-2">
                                    <MapPin className="w-5 h-5 text-teal-600" />
                                    <a
                                        href="https://www.google.com/maps?sca_esv=2286ae5c4aad172f&hl=es-419&authuser=0&kgs=d684a9a79c5868da&daddr=WH88%2B4J9,+Av.+Cacha,+Quito+170155"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-600 font-semibold hover:underline"
                                    >
                                        Calle Cacha y Fundadores, Quito
                                    </a>
                                </div>

                                {/* Teléfono */}
                                <div className="flex items-center justify-center space-x-2">
                                    <Phone className="w-5 h-5 text-teal-600" />
                                    <span>0995398645</span>
                                </div>

                                {/* Correo */}
                                <div className="flex items-center justify-center space-x-2">
                                    <Mail className="w-5 h-5 text-teal-600" />
                                    <span>aguilajordi@hotmail.com</span>
                                </div>

                                {/* Redes */}
                                <div className="flex flex-col items-center space-y-2 mt-3">
                                    <div className="flex items-center space-x-2">
                                        <Instagram className="w-5 h-5 text-pink-600" />
                                        <a
                                            href="https://www.instagram.com/Vet_DrPaw"
                                            target="_blank"
                                            className="font-semibold text-teal-700 hover:underline"
                                        >
                                            Vet_DrPaw
                                        </a>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Facebook className="w-5 h-5 text-blue-600" />
                                        <a
                                            href="https://www.facebook.com/DrPaw_Ecu"
                                            target="_blank"
                                            className="font-semibold text-teal-700 hover:underline"
                                        >
                                            DrPaw_Ecu
                                        </a>
                                    </div>
                                </div>

                                {/* Horarios */}
                                <div className="mt-4 text-center">
                                    <p className="font-semibold text-gray-900">🕒 Horarios</p>
                                    <p>Lunes a Sábado: 9:00 am – 7:00 pm</p>
                                    <p>Domingos: 9:00 am – 1:00 pm</p>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
