import { LoggerService } from "@nestjs/common";

const COLORS = {
    info: '\x1b[1;37m',
    debug: '\x1b[1;33m',
    error: '\x1b[0;31m',
    system: '\x1b[1;34m',
    access: '\x1b[1;38m',
    success: '\x1b[0;32m',  // Зеленый
    warning: '\x1b[0;33m',  // Желтый
    critical: '\x1b[1;31m', // Яркий красный
    notice: '\x1b[0;36m',   // Бирюзовый
    alert: '\x1b[1;35m',    // Яркий пурпурный
    emergency: '\x1b[0;41m', // Красный фон
    primary: '\x1b[0;34m',   // Синий
    secondary: '\x1b[0;35m', // Пурпурный
    tertiary: '\x1b[0;36m',  // Голубой
    muted: '\x1b[0;37m',     // Серый
    highlighted: '\x1b[0;43m', // Желтый фон
    inverse: '\x1b[0;7m', // Инверсный (белый фон, черный текст)
  };

// export class CustomLogger implements LoggerService {
//     log(message: string) {
//         console.log(chalk.blue(message)); 
//       }
    
//       error(message: string, trace: string) {
//         console.error(chalk.red(message)); 
//         console.error(chalk.red(trace));
//       }
    
//       warn(message: string) {
//         console.warn(chalk.yellow(message));
//       }
    
//       debug(message: string) {
//         console.debug(chalk.magenta(message)); // Пурпурный цвет для отладки
//       }
    
//       verbose(message: string) {
//         console.log(chalk.gray(message)); // Серый цвет для подробных сообщений
//       }
// }