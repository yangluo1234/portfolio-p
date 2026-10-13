"""Generate the portfolio's download CV from its verified content and project data."""
from pathlib import Path
import json, subprocess, shutil
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import reportlab
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT

font_dir = Path(reportlab.__file__).parent / 'fonts'
pdfmetrics.registerFont(TTFont('CVRegular', str(font_dir / 'Vera.ttf')))
pdfmetrics.registerFont(TTFont('CVBold', str(font_dir / 'VeraBd.ttf')))
pdfmetrics.registerFontFamily('CVRegular', normal='CVRegular', bold='CVBold', italic='CVRegular', boldItalic='CVBold')

ROOT = Path(__file__).resolve().parents[1]
data = json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {site, projects} from './src/data/siteData.js'; console.log(JSON.stringify({site,projects}));"], cwd=ROOT))
site=data['site']; projects={p['id']:p for p in data['projects']}
OUT=ROOT/'output/pdf/iris-luo-cv.pdf'; OUT.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(OUT), pagesize=(595.28,841.89))
c.setTitle('Iris Luo - UI/UX and interaction design'); c.setAuthor('Iris Luo')
ink=HexColor('#3b3046'); muted=HexColor('#625866'); accent=HexColor('#785267'); rule=HexColor('#d7d0d6')
styles={
 'body':ParagraphStyle('body',fontName='CVRegular',fontSize=10,leading=14,textColor=muted,alignment=TA_LEFT),
 'small':ParagraphStyle('small',fontName='CVRegular',fontSize=9,leading=13,textColor=muted),
 'title':ParagraphStyle('title',fontName='CVBold',fontSize=12,leading=16,textColor=ink),
}
def para(text,x,y,w,kind='body'):
 p=Paragraph(text.replace('·',' / ').replace('—','-').replace('’',"'").replace('→',' / '),styles[kind]); _,h=p.wrap(w,700); p.drawOn(c,x,y-h); return y-h

def section(title,x,y,w):
 c.setFillColor(accent); c.setFont('CVBold',10); c.drawString(x,y,title.upper()); c.setStrokeColor(rule); c.line(x,y-9,x+w,y-9); return y-25

c.setFillColor(ink); c.setFont('CVBold',32); c.drawString(38,790,'Iris Luo')
c.setFont('CVRegular',13); c.drawString(38,766,'UI/UX & interaction design')
y=para(site['resumeIntroduction'],38,746,315,'body')
cy=788
for text,url in [(site['location'],None),(site['email'],'mailto:'+site['email']),('LinkedIn',site['linkedin'])]:
 c.setFillColor(muted);c.setFont('CVRegular',9);c.drawRightString(557,cy,text)
 if url:c.linkURL(url,(400,cy-3,557,cy+10),relative=0,thickness=0)
 cy-=18
c.setStrokeColor(rule);c.line(38,696,557,696)
left, right, lw, rw =38,238,170,319
ly=section('Education',left,669,lw)
e=site['about']['journey'][0]
ly=para(e['title'],left,ly,lw,'title')-8
ly=para(e['copy'],left,ly,lw)-5
ly=para(e['year'],left,ly,lw,'small')-30
ly=section('Skills',left,ly,lw)
for group in site['about']['skillGroups']:
 ly=para(group['title'],left,ly,lw,'title')-5
 ly=para(', '.join(group['items']),left,ly,lw)-17
ly=section('Languages',left,ly-9,lw)
ly=para(', '.join(site['about']['languages']),left,ly,lw)-24

ry=section('Selected projects',right,669,rw)
copy={
 'doitnow': 'Designed a Figma planning prototype informed by one student interview and qualitative usability feedback. Kept suggested task plans editable and revised the heatmap layout and progress contrast.',
 'mapped-in-memory':'Contributed creative technology research, supporting narrative and UI/UX in a four-person team. Connected maps, AR missions and collectible story fragments in a proposed Chinatown visitor journey.',
 'watching-the-wait':'Independently designed, developed and deployed a scroll-based narrative about delivery tracking. Coordinated interface states, rider movement, ETA, motion and optional sound using HTML, CSS and JavaScript.',
 'lucky-scratch':'Built a browser experience around selecting, flipping and scratching cards to reveal encouraging messages. Connected each action with sound feedback using HTML, CSS and JavaScript.'
}
for pid in site['resume']['projectIds']:
 p=projects[pid]
 ry=para(p['title'],right,ry,rw,'title')-5
 ry=para(f"{p['year']} / {p['status']}",right,ry,rw,'small')-7
 ry=para(copy[pid],right,ry,rw)-7
 url=p.get('liveUrl') or p.get('videoUrl')
 if url:
  label='Live project' if p.get('liveUrl') else 'Concept walkthrough'
  c.setFillColor(accent);c.setFont('CVRegular',9);c.drawString(right,ry-9,label)
  c.linkURL(url,(right,ry-12,right+100,ry+1),relative=0,thickness=0)
  ry-=17
 ry-=18
assert min(ly,ry)>40, (ly,ry)
c.save()
shutil.copyfile(OUT,ROOT/'public/documents/iris-luo-cv.pdf')
print(f'Created one-page CV; content ends at y={min(ly,ry):.1f}')
