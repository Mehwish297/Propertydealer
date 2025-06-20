from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Plot
from .serializers import PlotSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.parsers import JSONParser
import json


@api_view(['GET'])
def get_plots(request):
    plots = Plot.objects.all()
    serializer = PlotSerializer(plots, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_plot(request):
    serializer = PlotSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Plot added successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def remove_plot(request):
    plot_number = request.data.get('plot_number')
    if not plot_number:
        return Response({'error': 'plot_number is required'}, status=400)
    
    try:
        plot = Plot.objects.get(plot_number=plot_number)
        plot.delete()
        return Response({'message': 'Plot removed successfully'})
    except Plot.DoesNotExist:
        return Response({'error': 'Plot not found'}, status=404)
# @csrf_exempt
# def add_plot(request):
#     if request.method == "POST":
#         title = request.POST.get("title")
#         location = request.POST.get("location")
#         price = request.POST.get("price")
#         plot_number = request.POST.get("plot_number")
#         image = request.FILES.get("image")

#         if not all([title, location, price, plot_number, image]):
#             return JsonResponse({"error": "Missing required fields"}, status=400)

#         Plot.objects.create(
#             title=title,
#             location=location,
#             price=price,
#             plot_number=plot_number,
#             image=image
#         )
#         return JsonResponse({"message": "Plot added successfully"})
#     return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def add_plot(request):
    if request.method == "POST":
        title = request.POST.get("title")
        location = request.POST.get("location")
        price = request.POST.get("price")
        plot_number = request.POST.get("plot_number")
        image = request.FILES.get("image")

        if not all([title, location, price, plot_number, image]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        if Plot.objects.filter(plot_number=plot_number).exists():
            return JsonResponse({"error": "Plot number already exists"}, status=409)

        plot = Plot.objects.create(
            title=title,
            location=location,
            price=price,
            plot_number=plot_number,
            image=image
        )

        return JsonResponse({
            "plot_number": plot.plot_number,
            "title": plot.title,
            "location": plot.location,
            "price": plot.price,
            "image": request.build_absolute_uri(plot.image.url)
        })
    return JsonResponse({"error": "Invalid request"}, status=400)
@csrf_exempt
def remove_plot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            plot_number = data.get("plot_number")
            plot = Plot.objects.get(plot_number=plot_number)
            plot.delete()
            return JsonResponse({"message": "Plot removed"})
        except Plot.DoesNotExist:
            return JsonResponse({"error": "Plot not found"}, status=404)
        except Exception:
            return JsonResponse({"error": "Invalid request"}, status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)
@api_view(['POST'])

def book_plot(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Booking successful'})
    return Response({'error': serializer.errors}, status=400)
@api_view(['GET'])
def get_bookings(request):
    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def remove_booking(request):
    booking_id = request.data.get('id')
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.delete()
        return Response({'message': 'Booking removed'})
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)