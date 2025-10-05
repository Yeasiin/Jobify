from rest_framework import permissions

class IsEmployeeOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == 'POST':
            return (request.user and request.user.is_authenticated and getattr(request.user, 'user_type', None) =='Employer')
        
         # For PUT/PATCH/DELETE → defer to object-level check
        return request.user and request.user.is_authenticated
    
    
    def has_object_permission(self, request, view, obj):
        print("DEBUG: obj.created_by =", obj.created_by)
        print("DEBUG: request.user =", request.user)
        print("DEBUG: comparison =", obj.created_by == request.user)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.created_by == request.user


 
    