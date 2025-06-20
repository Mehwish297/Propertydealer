from rest_framework import serializers
from .models import Plot
from .models import Booking

class PlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = '__all__'  
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
       
        # fields = ['id', 'name', 'email', 'phone', 'cnic', 'plot_number', 'booking_date']