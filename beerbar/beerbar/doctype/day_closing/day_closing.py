# Copyright (c) 2013, wayzon and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.email import sendmail
import os

class DayClosing(Document):
	def validate(self):
		#+++++++++++SEND EMAIL FUNCTION++++++++++++++++++++++++++++++++
		import time
		import smtplib,ssl
		from email.mime.multipart import MIMEMultipart
		from email.mime.base import MIMEBase
		from email.mime.text import MIMEText           
		from email.utils import COMMASPACE, formatdate
		from email import encoders 

		import datetime

		def send_mail(send_from,send_to,subject,text,files,server,port,username,password,isTls):
		    msg = MIMEMultipart()
		    msg['From'] = send_from
		    msg['To'] = send_to
		    msg['Date'] = formatdate(localtime = True)
		    msg['Subject'] = subject
		    part = MIMEBase('application', "octet-stream")
		    part.set_payload(open("/home/wayzon5/frappe-bench/sites/hotelsite/public/files/0106783940.sql", "rb").read())
		    encoders.encode_base64(part)
		    part.add_header('Content-Disposition', 'attachment; filename="0106783940.sql"')
		    msg.attach(part)
		    smtp = smtplib.SMTP('smtp.gmail.com',port)
		    if isTls:
		        smtp.starttls()
		    smtp.login(username,password)
		    smtp.sendmail(send_from, send_to, msg.as_string())
		    smtp.quit()
		#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		#++++++++++++++++++ BACKUP FUNCTION +++++++++++++++++++++++++++++++++++++++++++++++
		def backup():
			DB_HOST = 'localhost'
			DB_USER = 'root'
			DB_USER_PASSWORD = 'root'
			#DB_NAME = '/backup/dbnames.txt'
			DB_NAME = '0106783940'
			BACKUP_PATH = '/home/wayzon5/frappe-bench/sites/hotelsite/public/files/'

			# Getting current datetime to create seprate backup folder like "12012013-071334".
			DATETIME = time.strftime('%m%d%Y-%H%M%S')

			TODAYBACKUPPATH = BACKUP_PATH

			# Checking if backup folder already exists or not. If not exists will create it.
			print "creating backup folder"
			if not os.path.exists(TODAYBACKUPPATH):
			    os.makedirs(TODAYBACKUPPATH)

			# Code for checking if you want to take single database backup or assinged multiple backups in DB_NAME.
			print "checking for databases names file."
			if os.path.exists(DB_NAME):
			    file1 = open(DB_NAME)
			    multi = 1
			    print "Databases file found..."
			    print "Starting backup of all dbs listed in file " + DB_NAME
			else:
			    print "Databases file not found..."
			    print "Starting backup of database " + DB_NAME
			    multi = 0

			# Starting actual database backup process.
			if multi:
			   in_file = open(DB_NAME,"r")
			   flength = len(in_file.readlines())
			   in_file.close()
			   p = 1
			   dbfile = open(DB_NAME,"r")

			   while p <= flength:
			       db = dbfile.readline()   # reading database name from file
			       db = db[:-1]         # deletes extra line
			       dumpcmd = "mysqldump -u " + DB_USER + " -p" + DB_USER_PASSWORD + " " + db + " > " + TODAYBACKUPPATH + "/" + db + ".sql"
			       os.system(dumpcmd)
			       p = p + 1
			   dbfile.close()
			else:
			   db = DB_NAME
			   dumpcmd = "mysqldump -u " + DB_USER + " -p" + DB_USER_PASSWORD + " " + db + " > " + TODAYBACKUPPATH + "/" + db + ".sql"
			   os.system(dumpcmd)

			print "Backup script completed"
			print "Your backups has been created in '" + TODAYBACKUPPATH + "' directory"

		#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		d=self.date
		q1=frappe.db.sql("""select date from `tabDay Closing` where date=%s""",(d))
		if q1:
			frappe.throw("Cannot Save Duplicate Date")
		else:
			s=frappe.db.sql("""select brand, brand_name,brand_type, type_name,stock_quantity from `tabStock`""")
			j=len(s)
			for i in range (0, j):
				n=frappe.db.sql("""select max(cast(name as int)) from `tabDayCloseInfo`""")[0][0]
				if n:
					name=int(n)+1
				else:
					name=1
				q=frappe.db.sql("""insert into `tabDayCloseInfo` 
				set name=%s, date=%s, brand=%s, brand_name=%s, brand_type=%s, type_name=%s, closing_stock=%s""",(name,d,s[i][0],s[i][1],s[i][2],s[i][3],s[i][4]))
			
			if(self.email_id):
				backup()
				send_mail('wayzonwitherpnext@gmail.com','umapulkurte@gmail.com','Backup','text','/home/wayzon5/frappe-bench/sites/hotelsite/public/files/0106783940.sql','http://0.0.0.0:9898/',587,'wayzonwitherpnext@gmail.com','9028879946',True)
				frappe.msgprint("Backup sent")
			else:
				frappe.msgprint("Backup not sent")
	def on_trash(self):
		d=self.date
		q3=frappe.db.sql("""select date from `tabDayCloseInfo` where date=%s""",(d))
		if q3:
			q2=frappe.db.sql("""delete from `tabDayCloseInfo` where date=%s""",(d))