# Copyright (c) 2013, wayzon and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ReleaseToLoose(Document):
	def on_submit(self):
		brand=self.brand
		brand_name=self.brand_name
		brandtype=self.brand_type
		type_name=self.type_name
		qty=self.quantity
		total_qty=self.total_qty
		q=frappe.db.sql("""select stock_quantity from `tabStock` where brand=%s and brand_type=%s""",(brand,brandtype))
		if q:
			query=frappe.db.sql("""update `tabStock`
			set stock_quantity=stock_quantity-%s
			where brand=%s and brand_type=%s""",(qty,brand,brandtype))
			frappe.msgprint("Stock Updated")
		else:
			frappe.throw("Selected Brand is not available in Stock")
		q1=frappe.db.sql("""select brand, type, stock_ml from `tabLoose Stock` where brand=%s and type=%s""",(brand_name,type_name))
		if q1:
			sql=frappe.db.sql("""update `tabLoose Stock`
			set stock_ml=stock_ml+%s 
			where brand=%s and  type=%s""",(total_qty,brand_name,type_name))
			frappe.msgprint("Loose Stock Updated")
		else:
			q2=frappe.db.sql("""select max(cast(name as int)) from `tabLoose Stock`""")[0][0]
			if q2:
				name=int(q2)+int(1);
			else:
				name=1
			q3=frappe.db.sql("""insert into `tabLoose Stock` set name=%s, brand=%s, type=%s, stock_ml=%s""",(name,brand_name,type_name,total_qty))
			frappe.msgprint("New Loose Stock Entered")
@frappe.whitelist()
def get_stock(brand,brand_type):
	query=frappe.db.sql("""select stock_quantity from `tabStock` where brand=%s and brand_type=%s""",(brand,brand_type))
	if query:
		return query[0][0]
	else:
		query='0'
		return query