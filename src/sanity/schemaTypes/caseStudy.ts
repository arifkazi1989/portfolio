export const caseStudy = {
    name: 'caseStudy',
    title: 'Case Study',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Project title',
        type: 'string',
        validation: (Rule: any) =>
          Rule.required()
            .max(80)
            .warning('Project title should be under 80 characters for best layout display.'),
      },
      {
        name: 'slug',
        title: 'Slug (URL path)',
        type: 'slug',
        options: { source: 'title', maxLength: 96 },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 3,
        validation: (Rule: any) =>
          Rule.required()
            .max(160)
            .warning('Keep description under 160 characters.'),
      },
      {
        name: 'thumbnail',
        title: 'Cover image',
        type: 'image',
        options: { hotspot: true },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'isProtected',
        title: 'Protect Project',
        type: 'boolean',
        description: 'Require a password to view this project (e.g., for NDAs).',
        initialValue: false,
      },
      {
        name: 'password',
        title: 'Project Password',
        type: 'string',
        hidden: ({ document }: { document?: any }) => !document?.isProtected,
      },
      {
        name: 'company',
        title: 'Company / Client',
        type: 'string',
      },
      {
        name: 'industry',
        title: 'Industry',
        type: 'string',
      },
      {
        name: 'role',
        title: 'Your Role',
        type: 'string',
      },
      {
        name: 'platform',
        title: 'Platform',
        type: 'string',
      },
      {
        name: 'body',
        title: 'Case Study Content Blocks',
        type: 'array',
        of: [
          { type: 'block' },
          {
            type: 'image',
            options: { hotspot: true },
            fields: [
              {
                name: 'alt',
                title: 'Alt Text',
                type: 'string',
              },
              {
                name: 'caption',
                title: 'Caption',
                type: 'string',
              },
              {
                name: 'width',
                title: 'Image Width',
                type: 'string',
                description: 'Choose Compact for mobile UI screens, Medium, or Default full width.',
                initialValue: 'default',
                options: {
                  list: [
                    { title: 'Compact (Mobile UI)', value: 'compact' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'Default (Full Width)', value: 'default' },
                  ],
                  layout: 'radio',
                },
              },
            ],
          },
        ],
      },
    ],
  }