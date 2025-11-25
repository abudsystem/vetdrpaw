export default function AboutPage() {
    return (
        <div className="bg-white">

            {/* Header */}
            <div className="bg-teal-900 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                        Sobre Nosotros
                    </h1>
                    <p className="mt-6 text-xl text-teal-100 max-w-3xl mx-auto">
                        Dedicados a elevar el estándar del cuidado veterinario a través de la compasión,
                        la innovación y la excelencia.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

                {/* Misión y Equipo */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start mb-24">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Nuestra Misión
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Nuestra misión es proporcionar atención médica veterinaria de la más alta calidad,
                            tratando a cada paciente con el mismo amor y respeto que trataríamos a nuestras propias mascotas.
                            Nos esforzamos por educar a nuestros clientes y fomentar el vínculo humano-animal.
                        </p>

                        <h2 className="mt-10 text-3xl font-extrabold text-gray-900">
                            El Equipo
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Contamos con un equipo multidisciplinario de veterinarios especialistas, técnicos y
                            personal de apoyo apasionados por los animales. Cada miembro se capacita constantemente
                            para estar al día con los últimos avances médicos.
                        </p>
                    </div>

                    <div className="mt-10 lg:mt-0">
                        <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200 shadow-lg flex items-center justify-center h-96">
                            <span className="text-gray-400">Foto del Equipo</span>
                        </div>
                    </div>
                </div>

                {/* Historia de la veterinaria */}
                <div className="mb-24">
                    <h2 className="text-3xl font-extrabold text-gray-900">Nuestra Historia</h2>
                    <p className="mt-4 text-lg text-gray-500 max-w-3xl">
                        La Veterinaria Dr. Paw nació de un profundo amor por los animales y el deseo de ofrecer
                        un servicio profesional, humano y actualizado en el país.
                        Con formación en la Universidad Técnica de Ambato y más de una década de experiencia,
                        nuestro equipo ha crecido y evolucionado, siempre guiado por la pasión y el servicio.
                    </p>
                </div>

                {/* ¿Por qué elegirnos? */}
                <div className="mb-24 ">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
                        ¿Por qué elegirnos?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        <div className="text-center">
                            <div className="text-teal-700 text-5xl mb-4">🐾</div>
                            <h3 className="text-xl font-bold">Atención Personalizada</h3>
                            <p className="text-gray-500 mt-2">
                                Cada mascota es tratada como un miembro de nuestra familia.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-teal-700 text-5xl mb-4">💉</div>
                            <h3 className="text-xl font-bold">Profesionales Capacitados</h3>
                            <p className="text-gray-500 mt-2">
                                Veterinarios formados y actualizados con tecnología moderna.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-teal-700 text-5xl mb-4">❤️</div>
                            <h3 className="text-xl font-bold">Pasión por los Animales</h3>
                            <p className="text-gray-500 mt-2">
                                Trabajamos por vocación, no solo por profesión.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contador de logros */}
                <div className="bg-teal-50 py-16 rounded-xl mb-24 shadow-inner">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
                        Nuestros Logros
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">

                        <div>
                            <p className="text-4xl font-extrabold text-teal-700">+10</p>
                            <p className="text-gray-600 mt-2">Años de experiencia</p>
                        </div>

                        <div>
                            <p className="text-4xl font-extrabold text-teal-700">+1200</p>
                            <p className="text-gray-600 mt-2">Mascotas atendidas</p>
                        </div>

                        <div>
                            <p className="text-4xl font-extrabold text-teal-700">UTA</p>
                            <p className="text-gray-600 mt-2">Formación Profesional</p>
                        </div>

                    </div>
                </div>



            </div>
        </div>
    );
}
