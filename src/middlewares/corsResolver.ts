//@ts-nocheck
export function corsResolver(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   const {method} = req;
   if (method === 'OPTIONS') {
      // разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', '*');
      return res.end();
   }
   next();
   return 0;
}
