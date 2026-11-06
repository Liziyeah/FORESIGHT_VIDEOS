import json, math, os, sys, pymupdf, numpy as np
from PIL import Image
from vec import load, render
from clus import clusters
S = 3.0  # px per pt
R = lambda a, b: list(range(a, b + 1))
CFG = {
 'valentina': dict(src='girl', face=252, layers=[
     ('head', R(251, 261) + R(307, 310)),
     ('arm', 'L', dict(upper=[267, 268], fore=[262], hand=[263, 264, 265, 266])),
     ('arm', 'R', dict(upper=[274, 275], fore=[269], hand=[270, 271, 272, 273])),
     ('img', R(276, 306))],
   heads={'duda': 57, 'feliz': 75, 'sorpresa': 129, 'guino': 147, 'habla': 111, 'enojada': 93},
   hands={'puno': 31, 'rock': 51, 'paz': 46, 'senala': 39, 'abierta': 30}),
 'andres': dict(src='boy', face=250, layers=[
     ('img', R(227, 247)),
     ('head', R(248, 261)),
     ('arm', 'L', dict(upper=[263, 264, 265, 270], fore=[262], hand=[266, 267, 268, 269])),
     ('img', [271]),
     ('arm', 'R', dict(upper=[273, 274, 275, 280], fore=[272], hand=[276, 277, 278, 279])),
     ('img', [281, 282])],
   heads={'feliz': 99, 'habla': 54, 'sorpresa': 84, 'guino': 114, 'duda': 69, 'enojada': 130},
   hands={'puno': 28, 'senala': 36, 'abierta': 27, 'rock': 48, 'paz': 43}),
 'camila': dict(src='woman', face=218, layers=[
     ('img', R(178, 215)),
     ('head', R(216, 226) + R(237, 240) + R(280, 286)),
     ('img', R(227, 236) + R(241, 279) + R(287, 289))],
   heads={'feliz': 86, 'enojada': 132, 'sorpresa': 155, 'duda': 109}, hands={}),
}
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "app", "public", "personas")

def alpha(im): return np.array(im)[..., 3] > 40
def crop(im):
    bb = im.getbbox(); return im.crop(bb), bb
def centroid(m):
    ys, xs = np.nonzero(m); return np.array([xs.mean(), ys.mean()])

for name, cf in CFG.items():
    page, dr = load(cf['src']); by = {d['seqno']: d for d in dr}
    allids = [i for L in cf['layers'] for i in (L[1] if L[0] != 'arm' else sum(L[2].values(), []))]
    clip = pymupdf.Rect(by[allids[0]]['rect'])
    for i in allids: clip |= by[i]['rect']
    clip = clip + (-4, -4, 4, 4)
    ox, oy = (clip.x0 + clip.x1) / 2, None
    full = render([by[i] for i in sorted(allids)], clip, S)
    fb = full.getbbox(); feet = np.array([(fb[0] + fb[2]) / 2, fb[3]])  # origin: bottom centre
    H = fb[3] - fb[1]
    d = os.path.join(OUT, name); os.makedirs(d, exist_ok=True)
    full.crop(fb).save(os.path.join(d, 'vista.png'))
    rig = {'name': name, 'h': H, 'layers': [], 'arms': {}, 'heads': {}, 'hands': {}}
    def piece(ids, fname):
        im = render([by[i] for i in sorted(ids)], clip, S)
        c, bb = crop(im); c.save(os.path.join(d, fname)); return im, bb
    n = 0
    for L in cf['layers']:
        if L[0] == 'img':
            im, bb = piece(L[1], f'capa{n}.png'); n += 1
            rig['layers'].append({'t': 'img', 'file': f'capa{n-1}.png', 'x': bb[0] - feet[0], 'y': bb[1] - feet[1], 'w': bb[2] - bb[0], 'h': bb[3] - bb[1]})
        elif L[0] == 'head':
            im, bb = piece(L[1], 'cabeza-sonrisa.png')
            face = by[cf['face']]['rect']
            fx0, fy0, fx1, fy1 = [(v - o) * S for v, o in zip((face.x0, face.y0, face.x1, face.y1), (clip.x0, clip.y0, clip.x0, clip.y0))]
            piv = np.array([(fx0 + fx1) / 2, fy1 - (fy1 - fy0) * 0.12])
            rig['head'] = {'pivot': list(piv - feet)}
            rig['heads']['sonrisa'] = {'file': 'cabeza-sonrisa.png', 'x': bb[0] - piv[0], 'y': bb[1] - piv[1], 'w': bb[2] - bb[0], 'h': bb[3] - bb[1]}
            rig['layers'].append({'t': 'head'})
            # expression heads, registered on the face shape
            cl = clusters([x for x in dr if x['seqno'] != 0])
            fill0 = np.array(by[cf['face']]['fill'])
            for hn, h0 in cf['heads'].items():
                r, v = next(c for c in cl if min(x['seqno'] for x in c[1]) == h0)
                cand = [x for x in v if x.get('fill') and np.abs(np.array(x['fill']) - fill0).sum() < 0.12]
                fe = max(cand, key=lambda x: x['rect'].width * x['rect'].height)['rect']
                s = ((face.width / fe.width) + (face.height / fe.height)) / 2
                im2 = render(v, r, S * s); c2, bb2 = crop(im2)
                fcb = np.array([(face.x0 + face.x1) / 2 - clip.x0, (face.y0 + face.y1) / 2 - clip.y0]) * S
                fce = np.array([(fe.x0 + fe.x1) / 2 - r.x0, (fe.y0 + fe.y1) / 2 - r.y0]) * S * s
                tl = fcb - fce + np.array(bb2[:2])
                c2.save(os.path.join(d, f'cabeza-{hn}.png'))
                rig['heads'][hn] = {'file': f'cabeza-{hn}.png', 'x': tl[0] - piv[0], 'y': tl[1] - piv[1], 'w': c2.width, 'h': c2.height}
        else:
            side, parts = L[1], L[2]
            ims = {}
            for k in ('upper', 'fore', 'hand'):
                ims[k] = piece(parts[k], f'brazo{side}-{k}.png')
            mu, mf, mh = (alpha(ims[k][0]) for k in ('upper', 'fore', 'hand'))
            from scipy.ndimage import binary_dilation
            ov = binary_dilation(mu, iterations=2) & binary_dilation(mf, iterations=2)
            elbow = centroid(ov)
            ov2 = binary_dilation(mf, iterations=3) & binary_dilation(mh, iterations=3)
            wrist = centroid(ov2)
            ys, xs = np.nonzero(mu); pts = np.stack([xs, ys], 1)
            far = pts[np.argmax(((pts - elbow) ** 2).sum(1))]
            length = np.linalg.norm(far - elbow); width = mu.sum() / max(length, 1)
            shoulder = far + (elbow - far) / np.linalg.norm(elbow - far) * width * 0.5
            hc = centroid(mh)
            A = {}
            for k, p0 in (('upper', shoulder), ('fore', elbow), ('hand', wrist)):
                bb = ims[k][1]; A[k] = {'file': f'brazo{side}-{k}.png', 'x': bb[0] - p0[0], 'y': bb[1] - p0[1], 'w': bb[2] - bb[0], 'h': bb[3] - bb[1]}
            A['shoulder'] = list(shoulder - feet); A['elbow'] = list(elbow - shoulder); A['wrist'] = list(wrist - elbow)
            A['handDir'] = math.atan2(*(hc - wrist)[::-1])
            rig['arms'][side] = A
            rig['layers'].append({'t': 'arm', 'side': side})
    # gesture hands (fingers up, wrist at the bottom)
    if cf['hands']:
        cl = clusters([x for x in dr if x['seqno'] != 0])
        for hn, h0 in cf['hands'].items():
            r, v = next(c for c in cl if min(x['seqno'] for x in c[1]) == h0)
            im = render(v, r + (-2, -2, 2, 2), S); c, bb = crop(im); m = alpha(c)
            ys, xs = np.nonzero(m); y0 = ys.max() - (ys.max() - ys.min()) * 0.12
            sel = ys >= y0; w = np.array([xs[sel].mean(), ys[sel].mean()]); hc = centroid(m)
            c.save(os.path.join(d, f'mano-{hn}.png'))
            rig['hands'][hn] = {'file': f'mano-{hn}.png', 'x': -w[0], 'y': -w[1], 'w': c.width, 'h': c.height, 'dir': math.atan2(*(hc - w)[::-1])}
    json.dump(rig, open(os.path.join(d, 'rig.json'), 'w'), indent=1, default=float)
    print(name, 'h', H, 'heads', list(rig['heads']), 'hands', list(rig['hands']), 'arms', list(rig['arms']))
