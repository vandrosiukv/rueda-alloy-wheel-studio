/* global window */
// i18n module - EN / UK / ES

const LANG_LABEL = { en: 'English', uk: 'Українська', es: 'Español' };
const LANG_CODE  = { en: 'EN', uk: 'UK', es: 'ES' };
const LANG_LOCALE = { en: 'en-GB', uk: 'uk-UA', es: 'es-ES' };

const STR = {
  // brand & nav
  'brand.sub':         { en:'Alloy · studio',     uk:'Литі диски · студія', es:'Llantas · estudio' },
  'nav.workshop':      { en:'Workshop',           uk:'Майстерня',           es:'Taller' },
  'nav.account':       { en:'Account',            uk:'Кабінет',             es:'Cuenta' },
  'nav.dashboard':     { en:'Dashboard',          uk:'Огляд',               es:'Panel' },
  'nav.booking':       { en:'Booking',            uk:'Бронювання',          es:'Reserva' },
  'nav.services':      { en:'Services',           uk:'Послуги',             es:'Servicios' },
  'nav.garage':        { en:'My garage',          uk:'Мій гараж',           es:'Mi garaje' },
  'nav.history':       { en:'History',            uk:'Історія',             es:'Historial' },
  'nav.loyalty':       { en:'Loyalty',            uk:'Програма лояльності', es:'Fidelidad' },

  // topbar headings
  'top.dashboard.title':{ en:'Dashboard',          uk:'Огляд',               es:'Panel' },
  'top.dashboard.sub':  { en:'Overview of your account', uk:'Огляд вашого облікового запису', es:'Resumen de su cuenta' },
  'top.booking.title':  { en:'Book a slot',        uk:'Забронювати час',     es:'Reservar cita' },
  'top.booking.sub':    { en:'Schedule, edit or cancel', uk:'Створіть, змініть або скасуйте',  es:'Programar, editar o cancelar' },
  'top.services.title': { en:'Services',           uk:'Послуги',             es:'Servicios' },
  'top.services.sub':   { en:'Alloy restoration & tires', uk:'Реставрація дисків та шини',     es:'Restauración de llantas y neumáticos' },
  'top.garage.title':   { en:'My garage',          uk:'Мій гараж',           es:'Mi garaje' },
  'top.garage.sub':     { en:'Profile & vehicles', uk:'Профіль та авто',     es:'Perfil y vehículos' },
  'top.history.title':  { en:'History',            uk:'Історія візитів',     es:'Historial' },
  'top.history.sub':    { en:'Work log & spending', uk:'Журнал робіт і витрати', es:'Registro y gastos' },
  'top.loyalty.title':  { en:'Loyalty',            uk:'Лояльність',          es:'Fidelidad' },
  'top.loyalty.sub':    { en:'Tiers, points, referrals', uk:'Рівні, бали, запрошення', es:'Niveles, puntos, referencias' },

  'top.newBooking':    { en:'New booking',        uk:'Нове бронювання',     es:'Nueva reserva' },
  'top.notifications': { en:'Notifications',      uk:'Сповіщення',          es:'Notificaciones' },
  'top.toggleTheme':   { en:'Toggle theme',       uk:'Тема',                es:'Cambiar tema' },
  'top.language':      { en:'Language',           uk:'Мова',                es:'Idioma' },

  // common
  'c.off':             { en:'off',                uk:'знижка',              es:'desc.' },
  'c.minutes':         { en:'min',                uk:'хв',                  es:'min' },
  'c.from':            { en:'from',               uk:'від',                 es:'desde' },
  'c.primary':         { en:'Primary',            uk:'Основне',             es:'Principal' },
  'c.confirmed':       { en:'Confirmed',          uk:'Підтверджено',        es:'Confirmada' },
  'c.edit':            { en:'Edit',               uk:'Змінити',             es:'Editar' },
  'c.cancel':          { en:'Cancel',             uk:'Скасувати',           es:'Cancelar' },
  'c.confirm':         { en:'Confirm',            uk:'Підтвердити',         es:'Confirmar' },
  'c.save':            { en:'Save',               uk:'Зберегти',            es:'Guardar' },
  'c.continue':        { en:'Continue',           uk:'Далі',                es:'Continuar' },
  'c.back':            { en:'Back',               uk:'Назад',               es:'Atrás' },
  'c.remove':          { en:'Remove',             uk:'Видалити',            es:'Eliminar' },
  'c.close':           { en:'Close',              uk:'Закрити',             es:'Cerrar' },
  'c.copy':            { en:'Copy',               uk:'Копіювати',           es:'Copiar' },
  'c.all':             { en:'All',                uk:'Усі',                 es:'Todo' },
  'c.alloy':           { en:'Alloy',              uk:'Диски',               es:'Llantas' },
  'c.tires':           { en:'Tires',              uk:'Шини',                es:'Neumáticos' },
  'c.allVehicles':     { en:'All vehicles',       uk:'Усі авто',            es:'Todos los vehículos' },
  'c.closed':          { en:'Closed',             uk:'Зачинено',            es:'Cerrado' },
  'c.selected':        { en:'selected',           uk:'обрано',              es:'seleccionado(s)' },

  // dashboard
  'dash.greeting':     { en:'Welcome back',       uk:'Вітаємо знову',       es:'Bienvenido' },
  'dash.hello':        { en:"let's roll",         uk:'до роботи!',          es:'a rodar' },
  'kpi.spend':         { en:'Lifetime spend',     uk:'Загальні витрати',    es:'Gasto total' },
  'kpi.spend.foot':    { en:'across {n} visits',  uk:'за {n} візитів',      es:'en {n} visitas' },
  'kpi.vehicles':      { en:'Vehicles',           uk:'Автомобілі',          es:'Vehículos' },
  'kpi.vehicles.foot': { en:'primary {plate}',    uk:'основне {plate}',     es:'principal {plate}' },
  'kpi.upcoming':      { en:'Upcoming',           uk:'Заплановано',         es:'Próximas' },
  'kpi.upcoming.foot': { en:'next {when}',        uk:'наступний {when}',    es:'siguiente {when}' },
  'kpi.tier':          { en:'Tier',               uk:'Рівень',              es:'Nivel' },
  'kpi.tier.foot':     { en:'{pct}% off · {rest}', uk:'{pct}% знижка · {rest}', es:'{pct}% desc. · {rest}' },
  'kpi.tier.toNext':   { en:'{amount} to {tier}', uk:'{amount} до {tier}',  es:'{amount} para {tier}' },
  'kpi.tier.top':      { en:'top tier',           uk:'максимальний рівень', es:'nivel máximo' },

  'dash.upcoming':     { en:'Upcoming bookings',  uk:'Майбутні візити',     es:'Próximas reservas' },
  'dash.noUpcoming':   { en:'No bookings yet — choose a time when you are ready.', uk:'Бронювань ще немає — оберіть час, коли будете готові.', es:'Aún sin reservas — elija una hora cuando esté listo.' },
  'dash.recent':       { en:'Recent visits',      uk:'Останні візити',      es:'Visitas recientes' },
  'dash.viewAll':      { en:'View all',           uk:'Усі',                 es:'Ver todas' },
  'dash.garage':       { en:'Your garage',        uk:'Ваш гараж',           es:'Tu garaje' },
  'dash.garageCount':  { en:'{n} on file',        uk:'{n} в гаражі',        es:'{n} guardados' },
  'dash.manage':       { en:'Manage vehicles',    uk:'Керувати автомобілями', es:'Gestionar vehículos' },
  'dash.loyalty':      { en:'Loyalty progress',   uk:'Прогрес лояльності',  es:'Progreso de fidelidad' },
  'dash.spendMore':    { en:'Spend {amount} more to reach {tier} tier — unlock {pct}% off all services.', uk:'Витратьте ще {amount}, щоб досягти рівня {tier} — знижка {pct}% на всі послуги.', es:'Gaste {amount} más para alcanzar el nivel {tier} — obtenga {pct}% de descuento.' },
  'dash.topTier':      { en:'You are at the top tier — enjoy your perks!', uk:'Ви на найвищому рівні — насолоджуйтесь привілеями!', es:'¡Está en el nivel superior — disfrute sus beneficios!' },
  'dash.programDetails':{ en:'Program details',   uk:'Деталі програми',     es:'Detalles' },
  'dash.lastVisit':    { en:'Last visit',         uk:'Останній візит',      es:'Última visita' },
  'dash.handledBy':    { en:'Handled by {tech} on {date}', uk:'Майстер {tech}, {date}', es:'Atendido por {tech}, {date}' },
  'dash.yourRating':   { en:'your rating',        uk:'ваша оцінка',         es:'su valoración' },
  'dash.bookingCancelled':{ en:'Booking cancelled', uk:'Бронювання скасовано', es:'Reserva cancelada' },

  // booking
  'book.editing':      { en:'Editing',            uk:'Редагування',         es:'Editando' },
  'book.new':          { en:'New booking',        uk:'Нове бронювання',     es:'Nueva reserva' },
  'book.title.edit':   { en:'Edit your booking',  uk:'Редагувати бронювання', es:'Editar reserva' },
  'book.title.new':    { en:'Schedule a visit',   uk:'Заплануйте візит',    es:'Programar visita' },
  'book.step1':        { en:'Service & vehicle',  uk:'Послуги та авто',     es:'Servicio y vehículo' },
  'book.step2':        { en:'Date & time',        uk:'Дата і час',          es:'Fecha y hora' },
  'book.step3':        { en:'Review',             uk:'Перевірка',           es:'Revisión' },
  'book.chooseServices':{ en:'Choose services',   uk:'Виберіть послуги',    es:'Elija servicios' },
  'book.vehicle':      { en:'Vehicle',            uk:'Автомобіль',          es:'Vehículo' },
  'book.pickDay':      { en:'Pick a day',         uk:'Виберіть день',       es:'Elija un día' },
  'book.pickDayFirst': { en:'Pick a date to see available times.', uk:'Виберіть дату, щоб побачити доступний час.', es:'Elija una fecha para ver los horarios disponibles.' },
  'book.availableTimes':{ en:'Available times',   uk:'Доступний час',       es:'Horarios disponibles' },
  'book.sundayClosed': { en:'Closed on Sundays.', uk:'У неділю не працюємо.', es:'Cerrado los domingos.' },
  'book.review':       { en:'Review your booking', uk:'Перевірте дані',     es:'Revise su reserva' },
  'book.when':         { en:'When',               uk:'Коли',                es:'Cuándo' },
  'book.services':     { en:'Services',           uk:'Послуги',             es:'Servicios' },
  'book.duration':     { en:'Duration',           uk:'Тривалість',          es:'Duración' },
  'book.note':         { en:'Note for the team (optional)', uk:'Коментар для майстра (необов’язково)', es:'Nota para el equipo (opcional)' },
  'book.notePh':       { en:'e.g. curb scuff on rear-left wheel', uk:'напр., потертість на задньому лівому диску', es:'p. ej. roce en la llanta trasera izquierda' },
  'book.orderSummary': { en:'Order summary',      uk:'Підсумок',            es:'Resumen' },
  'book.pickOne':      { en:'Pick at least one service to start.', uk:'Виберіть хоча б одну послугу.', es:'Elija al menos un servicio.' },
  'book.subtotal':     { en:'Subtotal',           uk:'Сума',                es:'Subtotal' },
  'book.discount':     { en:'{tier} discount ({pct}%)', uk:'Знижка {tier} ({pct}%)', es:'Descuento {tier} ({pct}%)' },
  'book.total':        { en:'Total',              uk:'Разом',               es:'Total' },
  'book.finalPrice':   { en:'Final price · paid at the workshop', uk:'Остаточна ціна · оплата в майстерні', es:'Precio final · pago en el taller' },
  'book.location':     { en:'Workshop',           uk:'Майстерня',           es:'Taller' },
  'book.address':      { en:'Calle del Olivar 14, Sevilla', uk:'вул. Олівар 14, Севілья', es:'Calle del Olivar 14, Sevilla' },
  'book.hours':        { en:'Mon–Sat · 09:00 – 18:00', uk:'Пн–Сб · 09:00 – 18:00', es:'Lun–Sáb · 09:00 – 18:00' },
  'book.saveChanges':  { en:'Save changes',       uk:'Зберегти зміни',      es:'Guardar cambios' },
  'book.confirmed':    { en:'Booking confirmed',  uk:'Бронювання підтверджено', es:'Reserva confirmada' },
  'book.updated':      { en:'Booking updated',    uk:'Бронювання оновлено', es:'Reserva actualizada' },

  // services
  'svc.eyebrow':       { en:'Catalog',            uk:'Каталог',             es:'Catálogo' },
  'svc.title':         { en:'What we offer',      uk:'Наші послуги',        es:'Nuestros servicios' },
  'svc.intro':         { en:'Specialists in alloy wheel restoration — diamond cut, full refinish, polish, and complete tire service.', uk:'Спеціалісти з реставрації литих дисків — алмазна обробка, повне фарбування, полірування та шиномонтаж.', es:'Especialistas en restauración de llantas — corte de diamante, repintado, pulido y servicio completo de neumáticos.' },
  'svc.all':           { en:'All',                uk:'Усі',                 es:'Todo' },
  'svc.book':          { en:'Book',               uk:'Забронювати',         es:'Reservar' },
  'svc.turnkey':       { en:'Turnkey',            uk:'Під ключ',            es:'Llave en mano' },

  // service categories
  'cat.Alloy Restoration':{ en:'Alloy Restoration', uk:'Реставрація дисків', es:'Restauración de llantas' },
  'cat.Tire Service':     { en:'Tire Service',      uk:'Шинні послуги',     es:'Servicio de neumáticos' },
  'cat.Wheel Service':    { en:'Wheel Service',     uk:'Обслуговування',    es:'Servicio de ruedas' },

  // garage
  'gar.eyebrow':       { en:'Personal cabinet',   uk:'Особистий кабінет',   es:'Área personal' },
  'gar.title':         { en:'Profile & garage',   uk:'Профіль і гараж',     es:'Perfil y garaje' },
  'gar.addVehicle':    { en:'Add vehicle',        uk:'Додати авто',         es:'Añadir vehículo' },
  'gar.personal':      { en:'Personal info',      uk:'Особиста інформація', es:'Información personal' },
  'gar.email':         { en:'Email',              uk:'Email',               es:'Correo' },
  'gar.phone':         { en:'Phone',              uk:'Телефон',             es:'Teléfono' },
  'gar.tier':          { en:'Loyalty tier',       uk:'Рівень лояльності',   es:'Nivel de fidelidad' },
  'gar.memberSince':   { en:'Member since {when}', uk:'З нами з {when}',    es:'Miembro desde {when}' },
  'gar.editProfile':   { en:'Edit profile',       uk:'Редагувати профіль',  es:'Editar perfil' },
  'gar.vehicles':      { en:'Vehicles',           uk:'Автомобілі',          es:'Vehículos' },
  'gar.onFile':        { en:'{n} on file',        uk:'{n} у гаражі',        es:'{n} guardados' },
  'gar.wheels':        { en:'wheels {size}',      uk:'диски {size}',        es:'llantas {size}' },
  'gar.noVehicles':    { en:'No vehicles yet.',   uk:'Авто ще немає.',      es:'Aún sin vehículos.' },
  'gar.editTitle':     { en:'Edit vehicle',       uk:'Редагувати авто',     es:'Editar vehículo' },
  'gar.addTitle':      { en:'Add vehicle',        uk:'Додати авто',         es:'Añadir vehículo' },
  'gar.modalSub':      { en:'These details help us pick the right tools and consumables for your wheels.', uk:'Ці дані допоможуть нам підготувати правильні інструменти та матеріали.', es:'Estos datos nos ayudan a preparar las herramientas y materiales adecuados.' },
  'gar.plate':         { en:'Plate',              uk:'Номер',               es:'Matrícula' },
  'gar.year':          { en:'Year',               uk:'Рік',                 es:'Año' },
  'gar.make':          { en:'Make',               uk:'Марка',               es:'Marca' },
  'gar.model':         { en:'Model',              uk:'Модель',              es:'Modelo' },
  'gar.wheelSize':     { en:'Wheel size',         uk:'Розмір диска',        es:'Tamaño de llanta' },
  'gar.primaryLabel':  { en:'Set as primary vehicle', uk:'Зробити основним авто', es:'Establecer como vehículo principal' },
  'gar.added':         { en:'Vehicle added',      uk:'Авто додано',         es:'Vehículo añadido' },
  'gar.updated':       { en:'Vehicle updated',    uk:'Авто оновлено',       es:'Vehículo actualizado' },
  'gar.removed':       { en:'Vehicle removed',    uk:'Авто видалено',       es:'Vehículo eliminado' },

  // history
  'hist.eyebrow':      { en:'Visit log',          uk:'Журнал візитів',      es:'Registro de visitas' },
  'hist.title':        { en:'Service history',    uk:'Історія обслуговування', es:'Historial de servicios' },
  'hist.kpi.spend':    { en:'Lifetime spend',     uk:'Загальні витрати',    es:'Gasto total' },
  'hist.kpi.spend.foot':{ en:'across {n} visits', uk:'за {n} візитів',      es:'en {n} visitas' },
  'hist.kpi.alloy':    { en:'Alloy jobs',         uk:'Робіт з дисками',     es:'Trabajos en llantas' },
  'hist.kpi.alloy.foot':{ en:'restorations & refinish', uk:'реставрацій та фарбування', es:'restauraciones y repintados' },
  'hist.kpi.tires':    { en:'Tire jobs',          uk:'Робіт з шинами',      es:'Trabajos en neumáticos' },
  'hist.kpi.tires.foot':{ en:'mount, balance, repair', uk:'монтаж, балансування, ремонт', es:'montaje, equilibrado, reparación' },
  'hist.monthly':      { en:'Monthly spend',      uk:'Щомісячні витрати',   es:'Gasto mensual' },
  'hist.allVisits':    { en:'All visits',         uk:'Усі візити',          es:'Todas las visitas' },
  'hist.results':      { en:'{n} results · {total}', uk:'{n} записів · {total}', es:'{n} resultados · {total}' },
  'hist.col.date':     { en:'Date',               uk:'Дата',                es:'Fecha' },
  'hist.col.work':     { en:'Work',               uk:'Послуги',             es:'Trabajo' },
  'hist.col.vehicle':  { en:'Vehicle',            uk:'Авто',                es:'Vehículo' },
  'hist.col.tech':     { en:'Technician',         uk:'Майстер',             es:'Técnico' },
  'hist.col.rating':   { en:'Rating',             uk:'Оцінка',              es:'Valoración' },
  'hist.col.total':    { en:'Total',              uk:'Сума',                es:'Total' },

  // loyalty
  'loy.eyebrow':       { en:'Rueda Club',         uk:'Клуб Rueda',          es:'Club Rueda' },
  'loy.title':         { en:'Loyalty program',    uk:'Програма лояльності', es:'Programa de fidelidad' },
  'loy.memberTier':    { en:'Member tier',        uk:'Рівень',              es:'Nivel de socio' },
  'loy.since':         { en:'{name} · since {year}', uk:'{name} · з {year}', es:'{name} · desde {year}' },
  'loy.lifetime':      { en:'Lifetime: {amount}', uk:'Загалом: {amount}',   es:'Acumulado: {amount}' },
  'loy.toNext':        { en:'{tier}: {amount}',   uk:'{tier}: {amount}',    es:'{tier}: {amount}' },
  'loy.toUnlock':      { en:'{amount} more to unlock {pct}% off all services.', uk:'Ще {amount}, щоб отримати знижку {pct}%.', es:'{amount} más para desbloquear {pct}% de descuento.' },
  'loy.maxDiscount':   { en:'You enjoy our maximum {pct}% discount.', uk:'Ви маєте максимальну знижку {pct}%.', es:'Disfruta del máximo descuento del {pct}%.' },
  'loy.points':        { en:'Your points',        uk:'Ваші бали',           es:'Sus puntos' },
  'loy.earned':        { en:'Earned',             uk:'Накопичено',          es:'Acumulados' },
  'loy.redeemable':    { en:'Redeemable',         uk:'Доступно',            es:'Canjeables' },
  'loy.pointsHelp':    { en:'1 point per €1 spent. Redeem 100 points for €10 off your next service.', uk:'1 бал за €1. Обміняйте 100 балів на €10 знижки на наступну послугу.', es:'1 punto por cada €1 gastado. Canjee 100 puntos por €10 de descuento.' },
  'loy.redeem':        { en:'Redeem points',      uk:'Обміняти бали',       es:'Canjear puntos' },
  'loy.referrals':     { en:'Refer a friend',     uk:'Запросити друга',     es:'Recomendar a un amigo' },
  'loy.refHelp':       { en:'Both you and your friend get {credit} credit when they complete their first visit.', uk:'Ви і ваш друг отримаєте по {credit}, коли він прийде на перший візит.', es:'Ambos reciben {credit} de crédito cuando su amigo complete su primera visita.' },
  'loy.allTiers':      { en:'All tiers',          uk:'Усі рівні',           es:'Todos los niveles' },
  'loy.tiersSub':      { en:'Spend more, save more', uk:'Більше витрат — більше економії', es:'Gaste más, ahorre más' },
  'loy.current':       { en:'Current',            uk:'Поточний',            es:'Actual' },
  'loy.welcome':       { en:'Welcome',            uk:'Старт',               es:'Bienvenida' },
  'loy.thresh':        { en:'{amount} · {pct}% off', uk:'{amount} · знижка {pct}%', es:'{amount} · {pct}% desc.' },

  // tier perks (per tier name)
  'perk.Olivo':        { en:['Welcome bonus','Free wheel inspection','Standard slot booking'], uk:['Бонус за реєстрацію','Безкоштовна перевірка дисків','Стандартне бронювання'], es:['Bono de bienvenida','Inspección de llantas gratis','Reserva estándar'] },
  'perk.Barro':        { en:['5% off all services','Priority slot booking','Free wheel rotation'], uk:['Знижка 5% на всі послуги','Пріоритетне бронювання','Безкоштовне перестановлення коліс'], es:['5% de descuento','Reserva prioritaria','Rotación gratuita'] },
  'perk.Azafrán':      { en:['10% off all services','Free polish per visit','Saturday VIP slot'], uk:['Знижка 10% на всі послуги','Безкоштовне полірування за візит','VIP-час по суботах'], es:['10% de descuento','Pulido gratuito por visita','Hora VIP los sábados'] },
  'perk.Mediterráneo': { en:['15% off all services','Annual diamond-cut treatment','Personal account manager','Pickup & delivery'], uk:['Знижка 15% на всі послуги','Щорічна алмазна обробка','Персональний менеджер','Забір і доставка авто'], es:['15% de descuento','Tratamiento anual de corte de diamante','Gerente personal','Recogida y entrega'] },

  // tier names — kept in original (loanwords work in all languages)
  'tier.name.Olivo':        { en:'Olivo',         uk:'Оліво',               es:'Olivo' },
  'tier.name.Barro':        { en:'Barro',         uk:'Барро',               es:'Barro' },
  'tier.name.Azafrán':      { en:'Azafrán',       uk:'Азафран',             es:'Azafrán' },
  'tier.name.Mediterráneo': { en:'Mediterráneo',  uk:'Медітерранео',        es:'Mediterráneo' },

  // service catalog
  'svc.diamondCut.t': { en:'Diamond Cut Restoration', uk:'Алмазна обробка дисків', es:'Restauración con corte de diamante' },
  'svc.diamondCut.d': { en:'Precision lathe finish — restores the factory machined face on damaged alloys.', uk:'Високоточне токарне оброблення — відновлює заводську обробку на пошкоджених дисках.', es:'Acabado de torno de precisión — restaura la cara mecanizada de fábrica.' },
  'svc.fullRefinish.t': { en:'Full Refinish', uk:'Повне фарбування', es:'Repintado completo' },
  'svc.fullRefinish.d': { en:'Strip, sandblast, prime, paint, lacquer. Like new — your colour or original.', uk:'Зачистка, піскоструминна, грунт, фарба, лак. Як нові — ваш колір або оригінал.', es:'Decapado, chorreado, imprimación, pintura, laca. Como nuevas.' },
  'svc.curbRepair.t': { en:'Curb Damage Repair', uk:'Ремонт пошкоджень бордюром', es:'Reparación de roces' },
  'svc.curbRepair.d': { en:'Welding, filling, sanding, repaint of scuffed and gouged rims.', uk:'Зварювання, заповнення, шліфування, перефарбування потертих ободів.', es:'Soldadura, relleno, lijado y repintado de llantas rayadas.' },
  'svc.polish.t': { en:'Polish & Seal', uk:'Полірування і захист', es:'Pulido y sellado' },
  'svc.polish.d': { en:'Multi-stage polish for a deep mirror finish, sealed with ceramic-grade lacquer.', uk:'Багатоступеневе полірування до дзеркального блиску, ламінування керамічним лаком.', es:'Pulido multi-etapa con sellado cerámico.' },
  'svc.tireMount.t': { en:'Tire Mount & Balance', uk:'Шиномонтаж і балансування', es:'Montaje y equilibrado' },
  'svc.tireMount.d': { en:'Touchless mounting, road-force balancing, valve replacement.', uk:'Безконтактний монтаж, балансування з імітацією навантаження, заміна вентилів.', es:'Montaje sin contacto, equilibrado road-force, válvulas nuevas.' },
  'svc.tireRepair.t': { en:'Puncture Repair', uk:'Ремонт проколів', es:'Reparación de pinchazos' },
  'svc.tireRepair.d': { en:'Permanent plug-patch repair from inside the tire — safer than external plugs.', uk:'Постійний внутрішній ремонт латкою — надійніше за зовнішні джгути.', es:'Reparación interna con parche — más segura que los tapones externos.' },
  'svc.alignment.t': { en:'Wheel Alignment', uk:'Розвал-сходження', es:'Alineación de ruedas' },
  'svc.alignment.d': { en:'4-wheel laser alignment to manufacturer spec. Saves your tires.', uk:'Лазерне регулювання за заводськими параметрами. Зберігає шини.', es:'Alineación láser a la espec. del fabricante.' },
  'svc.seasonal.t': { en:'Seasonal Tire Swap', uk:'Сезонна заміна шин', es:'Cambio estacional' },
  'svc.seasonal.d': { en:'Summer / winter changeover with cleaning and storage available.', uk:'Заміна літо/зима з очищенням та можливістю зберігання.', es:'Cambio verano/invierno con limpieza y almacenamiento.' },

  'svc.unit.4wheels':  { en:'per 4 wheels',       uk:'за комплект',         es:'por 4 ruedas' },
  'svc.unit.perWheel': { en:'per wheel',          uk:'за диск',             es:'por rueda' },
  'svc.unit.set':      { en:'4 wheels + balance', uk:'4 шини + балансування', es:'4 ruedas + equil.' },
  'svc.unit.repair':   { en:'per repair',         uk:'за ремонт',           es:'por reparación' },
  'svc.unit.full':     { en:'full alignment',     uk:'повне регулювання',   es:'completa' },
  'svc.unit.swap':     { en:'4 wheels swap',      uk:'4 колеса',            es:'4 ruedas' },
  'svc.tag.featured':  { en:'★ Featured',         uk:'★ Рекомендовано',     es:'★ Destacado' },
  'svc.tag.alloy':     { en:'Alloy',              uk:'Диски',               es:'Llantas' },
  'svc.tag.tire':      { en:'Tire',               uk:'Шини',                es:'Neumáticos' },
};

const DOW = {
  en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  uk: ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'],
  es: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
};

function t(lang, key, vars) {
  const e = STR[key];
  if (!e) return key;
  let s = e[lang] || e.en || key;
  if (Array.isArray(s)) return s;
  if (vars) {
    Object.keys(vars).forEach(k => { s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
  }
  return s;
}

function tArr(lang, key) {
  const e = STR[key];
  if (!e) return [];
  return e[lang] || e.en || [];
}

function fmtMoney(n) {
  return '€' + Math.round(n).toLocaleString('en-GB');
}

function fmtDate(lang, iso, opts) {
  const d = new Date(iso);
  const o = { day: 'numeric', month: 'short' };
  if (opts && opts.year) o.year = 'numeric';
  if (opts && opts.weekday) o.weekday = 'short';
  return d.toLocaleDateString(LANG_LOCALE[lang], o);
}

function shortMonth(lang, d) {
  return d.toLocaleDateString(LANG_LOCALE[lang], { month: 'short' }).toUpperCase();
}

function monthLabel(lang, d) {
  return d.toLocaleDateString(LANG_LOCALE[lang], { month: 'long', year: 'numeric' });
}

Object.assign(window, { STR, DOW, LANG_LABEL, LANG_CODE, LANG_LOCALE, t, tArr, fmtMoney, fmtDate, shortMonth, monthLabel });
