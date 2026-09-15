// Кожен варіант вибору зберігається як пара {ua, de}.
// В інтерфейсі показуємо ua (українською), у фінальному резюме — лише de.

export const EXPERIENCE_OPTIONS = [
  { ua: 'Комплектація замовлень', de: 'Kommissionierung' },
  { ua: 'Керування навантажувачем', de: 'Staplerfahren' },
  { ua: 'Приймання та сортування товару', de: 'Wareneingang & Sortierung' },
  { ua: 'Пакування та маркування', de: 'Verpackung & Kennzeichnung' },
  { ua: 'Інвентаризація', de: 'Inventur' },
  { ua: 'Робота в команді', de: 'Teamarbeit' },
  { ua: 'Самостійна робота', de: 'Selbstständiges Arbeiten' }
];

export const SKILLS_OPTIONS = [
  { ua: 'Навантажувач (штабелер)', de: 'Stapler' },
  { ua: 'Електричний навантажувач', de: 'Elektrostapler' },
  { ua: 'Гідравлічна теліжка', de: 'Hubwagen' },
  { ua: 'Електрична теліжка ("мураха")', de: 'Elektrohubwagen' },
  { ua: 'Комплектувальний штабелер', de: 'Kommissionierstapler' },
  { ua: 'Сканер штрих-кодів', de: 'Barcode-Scanner' },
  { ua: 'Система управління складом (WMS)', de: 'Lagerverwaltungssystem' },
  { ua: 'Pick-by-Voice / термінал збору даних', de: 'Kommissioniergerät' },
  { ua: 'Пакувальна машина', de: 'Verpackungsmaschine' },
  { ua: 'Машина термоусадкової плівки', de: 'Schrumpffolienmaschine' },
  { ua: 'Принтер етикеток', de: 'Etikettendrucker' },
  { ua: 'Вагова система', de: 'Wiegesystem' },
  { ua: 'Робота на вантажній рампі', de: 'Verladerampe' },
  { ua: 'Робота в холодильній камері', de: 'Kühlhaus' },
  { ua: 'MS Office / Excel', de: 'MS Office / Excel' }
];

export const CERTIFICATE_OPTIONS = [
  { ua: 'Посвідчення водія навантажувача', de: 'Staplerschein' },
  { ua: 'Водійське посвідчення категорії B', de: 'Führerschein B' },
  { ua: 'Водійське посвідчення категорії C (вантажівка)', de: 'Führerschein C' },
  { ua: 'Курс першої допомоги', de: 'Erste-Hilfe-Kurs' },
  { ua: 'Інструктаж з техніки безпеки', de: 'Sicherheitsunterweisung' },
  { ua: 'Посвідчення кранівника', de: 'Kranführerschein' },
  { ua: 'Посвідчення оператора підйомної платформи', de: 'Hubarbeitsbühnenschein' },
  { ua: 'Курс з кріплення вантажу', de: 'Ladungssicherung-Kurs' },
  { ua: 'Дозвіл на перевезення небезпечних вантажів (ADR)', de: 'Gefahrgutschein (ADR)' },
  { ua: 'Курс пожежної безпеки', de: 'Brandschutzausbildung' },
  { ua: 'Санітарний мінімум / гігієна харчових продуктів', de: 'Hygieneschulung (HACCP)' },
  { ua: 'Сертифікат з німецької мови (ÖSD/ÖIF)', de: 'Deutschzertifikat (ÖSD/ÖIF)' }
];

export const LANGUAGE_LEVELS = [
  { ua: 'A1 — початковий', de: 'A1' },
  { ua: 'A2 — елементарний', de: 'A2' },
  { ua: 'B1 — середній', de: 'B1' },
  { ua: 'B2 — вище середнього', de: 'B2' }
];

export const EDUCATION_OPTIONS = [
  { ua: 'Обов\u2019язкова шкільна освіта', de: 'Pflichtschulabschluss' },
  { ua: 'Професійно-технічна освіта', de: 'Berufsausbildung' },
  { ua: 'Незакінчена вища освіта', de: 'Unvollständiges Hochschulstudium' },
  { ua: 'Вища освіта', de: 'Hochschulabschluss' }
];

// Поширені спеціальності/професії з перекладом німецькою — щоб уникнути
// буквальної транслітерації на кшталт "voditel" замість "Fahrer".
// Список не вичерпний: якщо потрібної спеціальності немає, форма
// пропонує ввести переклад вручну (тільки латиницею).
export const SPECIALTY_OPTIONS = [
  { ua: 'Водій', de: 'Fahrer' },
  { ua: 'Водій вантажівки', de: 'LKW-Fahrer' },
  { ua: 'Кухар / кухарка', de: 'Koch / Köchin' },
  { ua: 'Кондитер', de: 'Konditor' },
  { ua: 'Пекар', de: 'Bäcker' },
  { ua: 'М\u2019ясник', de: 'Fleischer' },
  { ua: 'Офіціант / офіціантка', de: 'Kellner / Kellnerin' },
  { ua: 'Бармен', de: 'Barkeeper' },
  { ua: 'Адміністратор готелю', de: 'Hotelfachkraft' },
  { ua: 'Покоївка', de: 'Zimmermädchen' },
  { ua: 'Швачка / кравець', de: 'Näher/in / Schneider/in' },
  { ua: 'Зварювальник', de: 'Schweißer' },
  { ua: 'Електрик', de: 'Elektriker' },
  { ua: 'Електромонтажник', de: 'Elektroinstallateur' },
  { ua: 'Слюсар', de: 'Schlosser' },
  { ua: 'Механік', de: 'Mechaniker' },
  { ua: 'Автомеханік', de: 'Kfz-Mechaniker' },
  { ua: 'Токар', de: 'Dreher' },
  { ua: 'Фрезерувальник', de: 'Fräser' },
  { ua: 'Столяр / тесляр', de: 'Tischler / Zimmermann' },
  { ua: 'Муляр', de: 'Maurer' },
  { ua: 'Маляр', de: 'Maler' },
  { ua: 'Штукатур', de: 'Verputzer' },
  { ua: 'Покрівельник', de: 'Dachdecker' },
  { ua: 'Сантехнік', de: 'Installateur' },
  { ua: 'Будівельник (різноробочий)', de: 'Bauhelfer' },
  { ua: 'Кранівник', de: 'Kranführer' },
  { ua: 'Прибиральник / прибиральниця', de: 'Reinigungskraft' },
  { ua: 'Перукар / перукарка', de: 'Friseur / Friseurin' },
  { ua: 'Косметолог / манікюрниця', de: 'Kosmetiker/in' },
  { ua: 'Масажист', de: 'Masseur' },
  { ua: 'Продавець', de: 'Verkäufer' },
  { ua: 'Касир', de: 'Kassierer' },
  { ua: 'Менеджер з продажу', de: 'Vertriebsmanager' },
  { ua: 'Менеджер з закупівель', de: 'Einkaufsmanager' },
  { ua: 'Бухгалтер', de: 'Buchhalter' },
  { ua: 'Економіст', de: 'Ökonom' },
  { ua: 'Фінансовий аналітик', de: 'Finanzanalyst' },
  { ua: 'Юрист', de: 'Jurist' },
  { ua: 'Вчитель / вчителька', de: 'Lehrer / Lehrerin' },
  { ua: 'Вихователь / вихователька', de: 'Erzieher / Erzieherin' },
  { ua: 'Соціальний працівник', de: 'Sozialarbeiter' },
  { ua: 'Медсестра / медбрат', de: 'Krankenpfleger/in' },
  { ua: 'Лікар', de: 'Arzt / Ärztin' },
  { ua: 'Стоматолог', de: 'Zahnarzt' },
  { ua: 'Фармацевт', de: 'Apotheker/in' },
  { ua: 'Ветеринар', de: 'Tierarzt' },
  { ua: 'Інженер', de: 'Ingenieur' },
  { ua: 'Інженер-будівельник', de: 'Bauingenieur' },
  { ua: 'Архітектор', de: 'Architekt' },
  { ua: 'Програміст', de: 'Programmierer' },
  { ua: 'Системний адміністратор', de: 'Systemadministrator' },
  { ua: 'Агроном', de: 'Agronom' },
  { ua: 'Тракторист', de: 'Traktorist' },
  { ua: 'Ветеринарний фельдшер', de: 'Veterinärtechniker' },
  { ua: 'Складський працівник', de: 'Lagerarbeiter' },
  { ua: 'Комплектувальник замовлень', de: 'Kommissionierer' },
  { ua: 'Вантажник', de: 'Lader' },
  { ua: 'Оператор верстата з ЧПУ', de: 'CNC-Bediener' },
  { ua: 'Оператор виробничої лінії', de: 'Fließbandarbeiter' },
  { ua: 'Швейцар / охоронець', de: 'Sicherheitsmitarbeiter' },
  { ua: 'Секретар', de: 'Sekretär/in' },
  { ua: 'Диспетчер', de: 'Disponent' },
  { ua: 'Логіст', de: 'Logistiker' },
  { ua: 'Няня', de: 'Kinderbetreuer/in' },
  { ua: 'Доглядальник / доглядальниця', de: 'Pflegehelfer/in' },
  { ua: 'Флорист', de: 'Florist' },
  { ua: 'Садівник', de: 'Gärtner' },
  { ua: 'Журналіст', de: 'Journalist' },
  { ua: 'Перекладач', de: 'Übersetzer' },
  { ua: 'Художник', de: 'Künstler' },
  { ua: 'Фотограф', de: 'Fotograf' }
];

export const RESUME_SECTION_TITLES = {
  personal: 'Persönliche Daten',
  experience: 'Berufserfahrung',
  skills: 'Fähigkeiten & Ausrüstung',
  certificates: 'Zertifikate',
  languages: 'Sprachkenntnisse',
  education: 'Ausbildung',
  targetRole: 'Lagerarbeiter / Lagerlogistik'
};
