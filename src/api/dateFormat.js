//преобразуем дату в нужный формат

export default function dateFormat(date){
	return `${date.getDate()}.${(date.getMonth+1)<10?'':'0'}${date.getMonth()+1}.${date.getFullYear()} ${(date.getHours())<10?'0':''}${date.getHours()}:${(date.getMinutes())<10?'0':''}${date.getMinutes()}`
}
