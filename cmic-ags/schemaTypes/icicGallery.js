// esquema icicGallery.js en Sanity Studio
export default {
  name: 'icicGallery',
  title: 'Galería ICIC',
  type: 'document',
  fields: [
    {
      name: 'titulo',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'imagen',
      title: 'Imagen',
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