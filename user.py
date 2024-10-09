from abc import ABC
import uuid

class User(ABC):
    def __init__(self,name,email,address):
        self.__id = uuid.uuid4().__str__()
        self.name = name
        self.email  = email
        self.address = address
    
    @property
    def id(self):
        return self.__id



class Client(User):
    def __init__(self,name,email,address,account_type,bank):
        super().__init__(name,email,address)
        self.acount_type = account_type
        self.__wallet = 0
        self.transitions = []
        self.loan_limit = 2
        self.whichBank = bank
        bank.add_user(self)

    def deposit(self,amount):
        if(amount>0):
            self.__wallet +=amount
            self.transitions.append({'type':"deposit",'amount':amount})
            print(f"{amount} successfully deposited\n")
            
        else:
            print("Amount is less then 0\n")

    def withdraw(self,amount):

        if self.whichBank.is_bankrupt:
            print("The Bank is Bankrupt, you can't withdraw\n")
        else:
            if(amount>self.__wallet):
                print("Withdrawal amount exceeded\n")
            else:
                self.__wallet -= amount
                print(f"{amount} is successfully Withdrawn\n")
                self.transitions.append({'type':"withdraw",'amount':amount})

    @property
    def check_balance(self):
        return self.__wallet

    def transition_history(self):
        print("**Transition history**")
        for transition in self.transitions:
            print( f"{transition['type']} - {transition['amount']}")
            
        print("\n")

    def take_loan(self,amount):

        if(self.whichBank.can_loan):
            if(self.loan_limit !=0):
                self.loan_limit -=1
                self.__wallet += amount
                self.whichBank.loan_amount += amount
                self.transitions.append({'type':"loan",'amount':amount})
                print("Loan taken successfully\n")
            else:
                print("Your personal loan quote exceed\n")
        else:
            print("Currently Loan Are Limited\n")

    def transfer_money(self,type,amount):
        if(type=="send"):
            self.transitions.append({'type':"send",'amount':amount})
            self.__wallet -= amount
        else:
            self.__wallet += amount
            self.transitions.append({'type':"receive",'amount':amount})


    def send_money(self,wallet_id,amount):
        if(self.__wallet>=amount):
            if self.whichBank.users.get(wallet_id):
                self.whichBank.users[wallet_id].transfer_money("receive",amount)
                self.transfer_money("send",amount)
                print(f"{amount} transferred to {wallet_id}")
            else:
                print(f"Account does not exit.\n")
        else:
            print("Not enough available balance.\n")



class Admin(User):
    def __init__(self, name, email, address,bank):
        super().__init__(name, email, address)
        self.whichBank = bank

    def delete_user(self,user_id):
        self.whichBank.delete_user(user_id)

    def all_users(self):
        self.whichBank.all_users()

    def check_balance(self):
        self.whichBank.total_amount()

    def check_loan_amount(self):
        self.whichBank.check_loan_amount()

    def switch_loan(self):
        choice = input("Switch loan feature: 'Y' On 'N' Off: ")
        if(choice.lower()=='y'):
            self.whichBank.switch_loan_options(True)
        else:
            self.whichBank.switch_loan_options(False)

    def declare_bankruptcy(self):
        self.whichBank.declare_bankruptcy()
