from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from plots import views

urlpatterns = [
    path('get-plots/', views.get_plots, name='get_plots'),
    path('add-plot/', views.add_plot, name='add_plot'),
    path('remove-plot/', views.remove_plot, name='remove_plot'),
     # Booking APIs
    path('book-plot/', views.book_plot, name='book_plot'),
    path('get-bookings/', views.get_bookings, name='get_bookings'),
    path('remove-booking/', views.remove_booking, name='remove_booking'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
