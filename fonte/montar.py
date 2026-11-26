# Monta o index.html a partir do motor e da história. Uso: python3 fonte/montar.py
import os
d=os.path.dirname(os.path.abspath(__file__))
m=open(os.path.join(d,'motor.html'),encoding='utf8').read()
h=open(os.path.join(d,'historia.js'),encoding='utf8').read()
assert '/*HISTORIA*/' in m
open(os.path.join(d,'..','index.html'),'w',encoding='utf8').write(m.replace('/*HISTORIA*/',h))
print('index.html montado')
