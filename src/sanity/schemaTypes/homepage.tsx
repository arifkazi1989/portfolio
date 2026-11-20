export const homepage = {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroTitle',
      title: 'Hero Greeting / Title',
      type: 'string',
      initialValue: "Hey, I'm Arif",
    },
    {
      name: 'heroBio',
      title: 'Hero Bio',
      type: 'text',
      rows: 5,
    },
    {
      name: 'skills',
      title: 'Skills Ticker Strip',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Items shown across the bottom bar of the Hero card.',
    },

    // My Story Section
    {
      name: 'storyPhotos',
      title: 'My Story Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', title: 'Caption / Alt', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'storyQuote',
      title: 'My Story Quote',
      type: 'string',
      initialValue: 'The most efficient network is a group of friends having fun - Kevin Kelly',
    },

    // Career Ladder Section
    {
      name: 'careerEntries',
      title: 'Career Ladder',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'company', title: 'Company', type: 'string' },
            { name: 'period', title: 'Period', type: 'string' },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 5,
              description: 'Shows a 2-line preview by default and expands when visitors click View more.',
            },
          ],
          preview: {
            select: {
              title: 'company',
              subtitle: 'role',
            },
          },
        },
      ],
    },

    // Contact Section
    {
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'arifkazi1989@gmail.com',
    },
    {
      name: 'phone',
      title: 'Contact Phone',
      type: 'string',
      initialValue: '+91 7045045899',
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    },
    {
      name: 'dribbbleUrl',
      title: 'Dribbble URL',
      type: 'url',
    },
    {
      name: 'mediumUrl',
      title: 'Medium URL',
      type: 'url',
    },
  ],
}