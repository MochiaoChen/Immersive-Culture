import { SceneOption } from './types';

export const SCENES: SceneOption[] = [
  {
    id: 'qingming',
    name: '清明上河图',
    shortDesc: '北宋汴京的繁华市井',
    description: '置身于张择端笔下的北宋都城，繁忙的汴河，熙攘的人群，古朴的虹桥。',
    promptModifier: 'Place the person into the bustling street scene of "Along the River During the Qingming Festival" (Qingming Shanghe Tu). Style: Traditional Chinese panoramic handscroll painting, meticulous Gongbi style, pale browns and greens (ink wash), Song Dynasty clothing and architecture, detailed city life.'
  },
  {
    id: 'tang_dynasty',
    name: '大唐盛世',
    shortDesc: '雍容华贵的盛唐气象',
    description: '漫步于长安城，牡丹盛开，金碧辉煌的宫殿，感受万国来朝的盛唐风采。',
    promptModifier: 'Place the person in a majestic Tang Dynasty palace garden scene with blooming peonies. Style: Rich and vibrant colors, opulent Tang aesthetics, "Heavy Color" (Zhongcai) style, elegant flowing Hanfu robes of the Tang era, golden ornaments, atmospheric and grand.'
  },
  {
    id: 'dunhuang',
    name: '敦煌飞天',
    shortDesc: '西域石窟的艺术瑰宝',
    description: '化身为莫高窟壁画中的飞天，飘逸的丝带，神秘的西域风情。',
    promptModifier: 'Transform the person into a celestial being (Apsara) from the Dunhuang Mogao Caves murals. Style: Ancient mural texture, mineral pigments (ochre, malachite green, azurite blue), floating ribbons, ethereal pose, desert cave background with Buddhist artistic elements.'
  },
  {
    id: 'jiangnan',
    name: '江南烟雨',
    shortDesc: '水墨丹青的诗意水乡',
    description: '泛舟于烟雨朦胧的江南水乡，黑瓦白墙，小桥流水。',
    promptModifier: 'Place the person on a small boat in a misty Jiangnan water town. Style: Classic Chinese Ink Wash Painting (Shui-mo), high contrast black ink on white paper, wet wash effects, traditional architecture with white walls and black tiles, serene and poetic atmosphere.'
  },
  {
    id: 'great_wall',
    name: '长城雄风',
    shortDesc: '巍峨连绵的万里长城',
    description: '伫立于群山之巅的烽火台上，苍松翠柏，云海翻腾。',
    promptModifier: 'Place the person standing heroically on the Great Wall of China during sunset. Style: Realistic oil painting style with Chinese artistic sensibilities, dramatic lighting, majestic mountains in the background, rolling clouds, ancient stone textures, Ming Dynasty armor or noble clothing.'
  },
  {
    id: 'peach_blossom',
    name: '桃花源记',
    shortDesc: '落英缤纷的世外桃源',
    description: '忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美。',
    promptModifier: 'Place the person in the utopian "Peach Blossom Spring". Style: Ethereal landscape painting (Shan Shui), blooming peach blossom trees everywhere, pink and green color palette, soft lighting, idyllic rural setting, simple yet elegant ancient hermit clothing.'
  }
];