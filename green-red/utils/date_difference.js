import {formateDistanceToNowStrict} from 'date-fns'

export const formateDistance = (date) => formateDistanceToNowStrict(new Date(date), {addSuffix: true})