import time, datetime

 




time_string = "16:04" 
obj = time.strptime(time_string, "%H:%M")


now = datetime.datetime.now()
todayon = now.replace(hour=obj.tm_hour, minute=obj.tm_min, second=0, microsecond=0)
seconds = (now - todayon).total_seconds()

print(todayon)

print(int(seconds))
