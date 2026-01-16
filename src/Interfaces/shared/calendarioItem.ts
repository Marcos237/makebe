import { Dayjs } from "dayjs";
import { HoraAgendadaItem } from '../Agendamento/horaAgendadaItem';

export interface CalendarioItem {
  monthRef?: Dayjs;
  highlightedDays?: number[];
  year?: number;
  months?: Dayjs[];
  onDayClick?: (date: Dayjs | null) => void | Promise<void>;
  clickedDates?: Dayjs[];
  tooltipItem?: string;
  isHoraOpen?: boolean;
  horaAgendadaItem?: HoraAgendadaItem;
  agendamentos?: Array<HoraAgendadaItem>;
  mes?: Number;
  onCloseClick?: () => void | Promise<void>;
  onUpdateClick?: (id?: number) => void | Promise<void>;
  onDeleteClick?: (id?: number) => void | Promise<void>;
  onNewClick?: (data?: string, id?: number) => void | Promise<void>;
  isReadOnly?: boolean;
}
