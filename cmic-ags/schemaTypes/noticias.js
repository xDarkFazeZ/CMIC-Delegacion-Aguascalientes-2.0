export default {
  name: 'noticia',       // importante: coincide con _type
  title: 'Noticias',
  type: 'document',
  fields: [
    {
      name: 'titulo',
      title: 'Título',
      type: 'string'
    },
    {
      name: 'contenido',
      title: 'Contenido',
      type: 'text'
    },
    {
      name: 'fecha',
      title: 'Fecha',
      type: 'datetime'
    },
    {
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true }
    }
  ]
}
