from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Book
from rest_framework.generics import get_object_or_404
from .serializer import BookSerializer


# Create your views here.
@api_view(['GET'])
def get_books(request):
    books = Book.objects.all().order_by('-id')[:5]
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_book(request):
    data =request.data 
    serializer = BookSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class BookListView(APIView):
#     """
#     Handles listing and creating books.
#     """
#     def get(self, request):
#         books = Book.objects.all().order_by('-id')[:5]  # Consider adding pagination for larger datasets
#         serializer = BookSerializer(books, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = BookSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE','PUT'])
def book_detail(request,pk):
    try:
        book = Book.objects.get(pk=pk)
        
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        data = request.data
        serializer = BookSerializer(book, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status= status.HTTP_201_CREATED)
        

# class BookDetailView(APIView):
#     """
#     Handles retrieving, updating, and deleting a specific book.
#     """
#     def get_object(self, pk):
#         return get_object_or_404(Book, pk=pk)

#     def delete(self, request, pk):
#         book = self.get_object(pk)
#         book.delete()
#         return Response({"detail": "Book deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

#     def put(self, request, pk):
#         book = self.get_object(pk)
#         serializer = BookSerializer(book, data=request.data, partial=True)  # Use partial=True for partial updates
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)