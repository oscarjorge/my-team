import {animate, state, style, transition, trigger} from '@angular/animations'


export const fundido=
trigger('fadeIn',[
    state('*', style({
        opacity:1
    })),
    transition(':enter',[
        style({
            opacity:0   
        }),
        animate('500ms linear')
    ]),
    transition(':leave',[
        style({
            opacity:0   
        }),
        animate('500ms linear')
    ])
]);