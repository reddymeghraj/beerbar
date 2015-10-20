# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
import os

version = '0.0.1'

setup(
    name='beerbar',
    version=version,
    description='App for bar',
    author='Wayzon',
    author_email='info@wayzon.cim',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=("frappe",),
)
