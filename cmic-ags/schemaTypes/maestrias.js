export default {
    name: 'maestrias',
    title: 'Maestrias',
    type: 'document',
    fields: [
        {
            name: 'nombre_maestria',
            title: 'Nombre de la Maestría',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'imagen',
            title: 'Imagen de la Maestría',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'objetivo_itc',
            title: 'Objetivo del ITC',
            type: 'text',
            rows: 3,
            description: 'Objetivo educativo que persigue el ITC con este programa',
            validation: Rule => Rule.required()
        },
        {
            name: 'requisitos',
            title: 'Requisitos',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Lista de requisitos para ingresar a la maestría'
        },
        {
            name: 'mapa_curricular',
            title: 'Mapa Curricular',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'semestre',
                    title: 'Semestre',
                    fields: [
                        {
                            name: 'titulo_semestre',
                            title: 'Título del Semestre',
                            type: 'string',
                            description: 'Ej: "Primer Semestre", "Cuatrimestre 1"',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'materias',
                            title: 'Materias',
                            type: 'array',
                            of: [{ type: 'string' }],
                            description: 'Lista de materias para este semestre',
                            validation: Rule => Rule.required().min(1)
                        }
                    ],
                    preview: {
                        select: {
                            title: 'titulo_semestre',
                            subtitle: 'materias.length'
                        },
                        prepare(selection) {
                            return {
                                title: selection.title,
                                subtitle: `${selection.subtitle || 0} materias`
                            }
                        }
                    }
                }
            ],
            description: 'Organiza las materias por semestre/cuatrimestre'
        },
        {
            name: 'detalles_maestria',
            title: 'Detalles de la Maestría',
            type: 'object',
            fields: [
                {
                    name: 'duracion',
                    title: 'Duración',
                    type: 'string',
                    description: 'Ej: "4 cuatrimestres", "2 años"'
                },
                {
                    name: 'modalidad_asignaturas',
                    title: 'Modalidad de Impartición',
                    type: 'string',
                    description: 'Ej: "Asignaturas impartidas mensualmente"'
                },
                {
                    name: 'horario',
                    title: 'Horario',
                    type: 'string',
                    description: 'Ej: "Viernes de 16:00 a 21:00, Sábados de 8:00 a 14:00"'
                },
                {
                    name: 'plataforma_tecnologica',
                    title: 'Plataforma Tecnológica',
                    type: 'string',
                    description: 'Ej: "Uso de Canvas/Moodle/Plataforma ITC"'
                },
                {
                    name: 'titulacion',
                    title: 'Modalidades de Titulación',
                    type: 'string',
                    description: '7 Modalidades de titulacion"'
                }
            ]
        }
    ],
    preview: {
        select: {
            title: 'nombre_maestria',
            media: 'imagen'
        },
        prepare(selection) {
            return {
                title: selection.title,
                subtitle: 'Maestría ITC',
                media: selection.media
            }
        }
    }
}