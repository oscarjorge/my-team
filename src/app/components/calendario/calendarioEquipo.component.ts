import {
    Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, Input, DoCheck
} from '@angular/core';
import {
    startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, DAYS_OF_WEEK
} from 'angular-calendar';
import { TorneosService } from '../../services/torneos.service';
import { EquiposService } from '../../services/equipos.service';
import { CamposService } from '../../services/campos.service';
const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};
@Component({
    selector: 'calendarioEquipo',
    templateUrl: './calendarioEquipo.component.html',
    styles: ['./calendarioEquipo.component.css']
})
export class CalendarioEquipoComponent implements OnInit, DoCheck {
    @Input() partidos: any[];
    partidosOld: any[];
    locale: string = 'es';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
    view: string = 'month';
    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen: boolean = false;

    constructor(
        //   private modal: NgbModal
        private _torneosService: TorneosService,
        private _equiposService: EquiposService,
        private _camposService: CamposService,
    ) { }
    ngDoCheck() {
        if (this.partidos != null && this.partidos.length > 0) {
            if (this.partidos[0].Torneo != this.partidosOld[0].Torneo) {
                this.initilizeCalendar();
            }
        }
    }
    ngOnInit() {
        this.initilizeCalendar();
    }
    initilizeCalendar() {
        if (this.partidos != null) {
            this._equiposService.getEquipos().subscribe(equipos => {
                this._camposService.getRegistros().subscribe(campos => {
                    let calendarEvents: CalendarEvent[] = [];
                    this.partidos.forEach(partido => {
                        let equipoLocal = equipos.find(e => e.$key == partido.EquipoLocal).Nombre;
                        let equipoVisitante = equipos.find(e => e.$key == partido.EquipoVisitante).Nombre;
                        let campo = campos.find(e => e.$key == partido.Campo).Nombre;
                        let title = `${equipoLocal} - ${equipoVisitante} a las ${partido.Hora.Horas}:${partido.Hora.Minutos} (${campo})`
                        calendarEvents.push({
                            start: new Date(partido.Fecha.date.year, partido.Fecha.date.month - 1, partido.Fecha.date.day, parseInt(partido.Hora.Horas), parseInt(partido.Hora.Minutos)),
                            end: new Date(partido.Fecha.date.year, partido.Fecha.date.month - 1, partido.Fecha.date.day, parseInt(partido.Hora.Horas), parseInt(partido.Hora.Minutos)),
                            title: title,
                            color: colors.red,
                            actions: this.actions
                        })
                    })
                    this.events = calendarEvents;
                    this.partidosOld = this.partidos;
                })
            });

        }
    }
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        // this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
        this.events.push({
            title: 'New event',
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            color: colors.red,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });
        this.refresh.next();
    }
}