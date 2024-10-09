from bank import Bank
from user import Client, Admin


def user_func(bank):
    name = input("Enter Name: ")
    email = input("Enter Email: ")
    address = input("Enter Address: ")
    account_type = input("Enter Account Type (Savings / Current): ")
    user = Client(name,email,address,account_type,bank)

    while True:
        print(f"Welcome {name} wallet: {user.id} ")
        print("1. Deposit")
        print("2. Withdraw")
        print("3. Check Available Balance")
        print("4. Check Transaction History")
        print("5. Take Loan")
        print("6. Transfer Amount")
        print("7. Exit")

        choice = int(input("Your Choice: "))

        if(choice ==1):
            amount = int(input("Deposit Amount: "))
            user.deposit(amount)
        elif choice==2:
            amount = int(input("Withdraw Amount: "))
            user.withdraw(amount)
        elif choice==3:
            print(f"Available balance is: {user.check_balance}\n")
        elif choice==4:
            user.transition_history()
        elif choice==5:
            amount = int(input("Asked Loan Amount: "))
            user.take_loan(amount)
        elif choice==6:
            user_id = input("Enter User id: ")
            if(user_id==user.id):
                print("Select different user")
            else:
                amount = int(input("Enter Amount: "))
                user.send_money(user_id,amount)

        elif choice==7:
            break


def admin_func(bank):
    name = input("Enter Name: ")
    email = input("Enter Email: ")
    address = input("Enter Address: ")

    admin = Admin(name,email, address,bank)

    while True:
        print(f"Welcome Admin {name} id: {admin.id} ")
        print("1. Delete Account")
        print("2. See All User")
        print("3. Check Bank Total Balance")
        print("4. Check Loan Amount")
        print("5. Switch Loan Features")
        print("6. Declare Bankruptcy")
        print("7. Exit")
        
        choice = int(input("Your Choice: "))

        if choice==1:
            user_id = input("Enter user id: ")
            admin.delete_user(user_id)
        elif choice==2:
            admin.all_users()
        elif choice==3:
            admin.check_balance()
        elif choice ==4:
            admin.check_loan_amount()
        elif choice ==5:
            admin.switch_loan()
        elif choice ==6:
            admin.declare_bankruptcy()
        elif choice==7:
            break

        

    # Bank 
bank = Bank("IFIC")

while True:
    print("1. as User \n2. as Admin \n3. Exit")
    choice = int(input("Your choice: "))

    if choice ==1:
        user_func(bank)
    elif choice ==2:
        admin_func(bank)
    elif choice ==3:
        break
    else:
        print("Invalid choice\n")












