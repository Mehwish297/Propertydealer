from django.db import models

class Plot(models.Model):
    plot_number = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    price = models.CharField(max_length=100)
    image = models.ImageField(upload_to='plots/')

    def __str__(self):
        return self.title
class Booking(models.Model):
  
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    cnic = models.CharField(max_length=15)
    plot_number = models.CharField(max_length=10)
    booking_date = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.name} - {self.plot_number}"