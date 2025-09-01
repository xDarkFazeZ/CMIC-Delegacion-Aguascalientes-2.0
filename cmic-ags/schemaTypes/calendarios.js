// esquema calendarioCursos.js en Sanity Studio
export default {
  name: 'calendarioCursos',
  title: 'Calendario de Cursos',
  type: 'document',
  fields: [
    {
      name: 'titulo',
      title: 'Título',
      type: 'string',
      initialValue: 'Calendario de Cursos'
    },
    {
      name: 'imagen',
      title: 'Imagen del Calendario',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'descripcion',
      title: 'Descripción',
      type: 'array',
      of: [{type: 'block'}]
    },
  ],
}