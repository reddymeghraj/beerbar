# Copyright (c) 2013, wayzon and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Purchase(Document):
	def on_submit(self):
		ls=self.purchaseinfo
		for i in range(len(ls)):
			brand=ls[i].brand
			brandname=ls[i].brand_name
			btype=ls[i].brand_type
			btypename=ls[i].type_name
			qnty=ls[i].quantity
			q1=frappe.db.sql("""select stock_quantity from `tabStock` where brand=%s and brand_name=%s and brand_type=%s and type_name=%s""",(brand,brandname,btype,btypename))
			if q1:
				query=frappe.db.sql("""update `tabStock`
				set stock_quantity=stock_quantity+%s 
				where brand=%s and brand_type=%s""",(qnty,brand,btype))
				frappe.msgprint("Stock Updated")
			else:
				q3=frappe.db.sql("""select max(cast(name as int)) from `tabStock`""")[0][0]
				if q3:
					name=int(q3)+1;
				else:
					name=1	
				q2=frappe.db.sql("""insert into `tabStock` set name=%s, brand=%s, brand_name=%s, brand_type=%s,
				type_name=%s, stock_quantity=%s""",(name,brand,brandname,btype,btypename,qnty))
				frappe.msgprint("New Entry addede in Stock!")
		#-----------------------
		#Display Amount in words
		#-----------------------
		from frappe.utils import money_in_words
		self.net_pay_in_words = money_in_words(self.net_pay, 'INR')

@frappe.whitelist()
def get_brand_name(bname):
	q=frappe.db.sql("""select brand_name from `tabAdd Brand` where name=%s""",bname)[0][0]
	return q

@frappe.whitelist()
def get_brand_type(btype):
	q=frappe.db.sql("""select brand_type from `tabAdd Brand Type` where name=%s""",(btype))[0][0]
	return q

@frappe.whitelist()
def get_money_in_words(n):
	from frappe.utils import money_in_words
	from frappe.utils import in_words
	x=money_in_words(n)
	return (x)