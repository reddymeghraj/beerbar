# Copyright (c) 2013, wayzon and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Searchorder(Document):
	pass

def show_list(d,t,c,w):
	header="""
	<style>
		#n1{
		display:none;
		}
		#n2{
		display:none;
		}
	</style>
	<table border=5 id="Tbl1">
	<tr align=left><th colspan="1">Date:%s</th><th></th><th colspan="3">Table No:%s</th></tr>
	<tr align=left><th colspan="1">Customer Name:%s</th><th></th><th colspan="3">Waiter Name:%s</th></tr>
	<tr bgcolor=LightGrey align=center><td width=150 id='n2'>Name</td><td width=200 ><b>Item</td><td width=150 ><b>Type</td>
	<td width=100 ><b>Qty</td><td width=100><b>Rate</td><td width=100 ><b>Amount</td></tr>"""  %(d,t,c,w)
	return header
@frappe.whitelist()
def get_order_details(o):
	a=''
	m=frappe.db.sql("""select name,item,btype,quantity,rate,amount,qty_pack,no_of_packs,rate_pack,date,table_no,customer_name,waiter_name from `tabOrder Item` where order_id=%s and order_status='Completed'""",(o))
	if m:
		l=len(m)
		t_amt=0
		for i in range(0, l):
			if(m[i][3]==0):
				html_str="""
				<tr align=center id=%s><td id='n2'>%s</td><td>%s</td><td>%s</td><td>%sml*%s</td><td>%s</td><td>%s</td></tr>""" %(i,m[i][0],m[i][1],m[i][2],m[i][6],m[i][7],m[i][8],m[i][5])
				t_amt=t_amt+int(m[i][5])
				a=a+html_str
			else:
				html_str="""
				<tr align=center id=%s><td id='n2'>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>""" %(i,m[i][0],m[i][1],m[i][2],m[i][3],m[i][4],m[i][5])
				a=a+html_str
				t_amt=t_amt+int(m[i][5])
		ttl_str="""
		<tr align=center><td id='n2'></td><td>Total</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td></td>""" %('','','',t_amt)
		return (show_list(m[0][9],m[0][10],m[0][11],m[0][12])+a+ttl_str)
	else:
		frappe.msgprint('Entered Order Id does not exist')
		return(show_list('','','',''))