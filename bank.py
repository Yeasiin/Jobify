class Bank:
    def __init__(self,name):
        self.name = name
        self.users = {}
        self.loan_amount = 0
        self.can_loan = True
        self.is_bankrupt = False

    def add_user(self,user):
        self.users[user.id] = user
        print(f"Account for {user.name} Created Successfully\n")
            
    def total_amount(self):
        sum =0
        for user in self.users.values():
            sum+= user.check_balance
        
        print(f"Total Available Balance: {sum}\n")


    def delete_user(self,user_id):
        if user_id in self.users:
            print(f"{self.users[user_id].name}'s account is deleted!!\n")
            del self.users[user_id]
        else:
            print("User doesn't exit\n")


    def all_users(self):
        print("**All User**")
        for user in self.users.values():
            print(f"Username: {user.name} and Amount: {user.check_balance} id: {user.id}" )
        print("\n")

    def check_loan_amount(self):
        print("Total Loaned Amount: ", self.loan_amount,"\n")

    def switch_loan_options(self,value):
        self.can_loan = value
        if(self.can_loan):
            print("Bank re-Opened the loan options\n")
        else:
            print("Bank Switched Off the loan options\n")

    def declare_bankruptcy(self):
        self.is_bankrupt= True
        print("Bank is now declared as bankrupt\n")

