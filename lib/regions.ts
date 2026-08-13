export const REGIONS = [
  "Toshkent",
  "Toshkent viloyati",
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Xorazm viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati",
  "Qoraqalpog'iston",
] as const;

export const REGION_CENTROIDS: Record<string, [number, number]> = {
  "Toshkent": [41.2995, 69.2401],
  "Toshkent viloyati": [41.05, 69.35],
  "Andijon viloyati": [40.7833, 72.35],
  "Buxoro viloyati": [39.7747, 64.4286],
  "Farg'ona viloyati": [40.3864, 71.7864],
  "Jizzax viloyati": [40.1158, 67.8422],
  "Xorazm viloyati": [41.55, 60.6333],
  "Namangan viloyati": [40.9983, 71.6726],
  "Navoiy viloyati": [40.0844, 65.3792],
  "Qashqadaryo viloyati": [38.86, 65.7891],
  "Samarqand viloyati": [39.6542, 66.9758],
  "Sirdaryo viloyati": [40.8367, 68.6606],
  "Surxondaryo viloyati": [37.9401, 67.5719],
  "Qoraqalpog'iston": [42.4531, 59.6103],
};

export const UZBEKISTAN_CENTER: [number, number] = [41.3775, 64.5853];
