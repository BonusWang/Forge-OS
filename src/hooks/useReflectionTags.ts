import type { Reflection } from '../types';

export const generateTags = (
  template: Reflection['template'],
  answers: Reflection['answers']
): string[] => {
  const tags: string[] = [];

  if (template === 'obstacle-breakthrough') {
    tags.push('障碍突破');

    const control = answers.control;
    if (control >= 7) {
      tags.push('高掌控感');
    } else if (control <= 4) {
      tags.push('低掌控感');
    }
  }

  return tags;
};

export default generateTags;
