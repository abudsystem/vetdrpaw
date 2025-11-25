export default function History() {
    return (
        <div className="bg-white py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Nuestra Historia</h2>
                    <p className="mt-4 text-lg text-gray-500">De un pequeño consultorio a un centro integral.</p>
                </div>
                <div className="relative border-l-4 border-teal-500 ml-6 md:ml-auto md:mr-auto md:w-2/3 space-y-12 pl-8">
                    <div className="relative">
                        <span className="absolute -left-12 top-0 bg-teal-500 h-8 w-8 rounded-full border-4 border-white"></span>
                        <h3 className="text-xl font-bold text-gray-900">2010</h3>
                        <p className="text-gray-500">Fundación de VetDrPaw por el Dr. Abud. Un sueño de traer medicina de calidad a la comunidad.</p>
                    </div>
                    <div className="relative">
                        <span className="absolute -left-12 top-0 bg-teal-500 h-8 w-8 rounded-full border-4 border-white"></span>
                        <h3 className="text-xl font-bold text-gray-900">2015</h3>
                        <p className="text-gray-500">Expansión a nuevas instalaciones con quirófano avanzado y laboratorio propio.</p>
                    </div>
                    <div className="relative">
                        <span className="absolute -left-12 top-0 bg-teal-500 h-8 w-8 rounded-full border-4 border-white"></span>
                        <h3 className="text-xl font-bold text-gray-900">2023</h3>
                        <p className="text-gray-500">Implementación de telemedicina y sistema de gestión digital integral.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
