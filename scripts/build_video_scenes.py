from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path("/tmp/agastya-video-scenes")
OUTPUT.mkdir(parents=True, exist_ok=True)

WIDTH, HEIGHT = 1280, 720
BG = (6, 8, 15)
TEXT = (244, 247, 255)
SOFT = (190, 202, 220)
MUTED = (145, 158, 181)
CYAN = (55, 230, 255)
VIOLET = (155, 108, 255)
GREEN = (98, 246, 180)

FONT_REGULAR = "/System/Library/Fonts/Avenir Next.ttc"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size=size)


def base_canvas(photo_name, crop_shift=0):
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(canvas, "RGBA")

    for x in range(WIDTH):
        ratio = x / WIDTH
        draw.line((x, 0, x, HEIGHT), fill=(int(6 + 8 * ratio), int(8 + 4 * ratio), int(15 + 18 * ratio), 255))

    for x in range(0, WIDTH, 56):
        draw.line((x, 0, x, HEIGHT), fill=(215, 228, 255, 9))
    for y in range(0, HEIGHT, 56):
        draw.line((0, y, WIDTH, y), fill=(215, 228, 255, 9))

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow, "RGBA")
    glow_draw.ellipse((760, -240, 1340, 340), fill=(*VIOLET, 42))
    glow_draw.ellipse((310, 410, 920, 1020), fill=(*CYAN, 28))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow)

    photo = Image.open(ROOT / "assets" / "images" / photo_name).convert("RGB")
    scale = max(610 / photo.width, HEIGHT / photo.height)
    resized = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - 610) // 2 + crop_shift)
    photo = resized.crop((left, 0, left + 610, HEIGHT))
    photo = ImageEnhance.Contrast(photo).enhance(1.04)
    photo = ImageEnhance.Color(photo).enhance(0.92)

    mask = Image.new("L", (610, HEIGHT), 255)
    mask_draw = ImageDraw.Draw(mask)
    for x in range(380, 610):
        opacity = int(255 * max(0, 1 - ((x - 380) / 230) ** 1.25))
        mask_draw.line((x, 0, x, HEIGHT), fill=opacity)
    canvas.alpha_composite(Image.merge("RGBA", (*photo.split(), mask)), (0, 0))

    shade = Image.new("RGBA", (610, HEIGHT), (0, 0, 0, 0))
    shade_draw = ImageDraw.Draw(shade, "RGBA")
    shade_draw.rectangle((0, 0, 610, 150), fill=(3, 6, 12, 35))
    shade_draw.rectangle((0, 520, 610, 720), fill=(3, 6, 12, 75))
    canvas.alpha_composite(shade, (0, 0))

    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.rounded_rectangle((34, 30, 105, 101), radius=18, fill=(12, 18, 31, 220), outline=(*CYAN, 90), width=2)
    draw.text((69, 66), "AK", font=font(22, True), fill=TEXT, anchor="mm")
    draw.ellipse((54, 46, 60, 52), fill=CYAN)
    draw.ellipse((80, 80, 86, 86), fill=VIOLET)
    return canvas


def eyebrow(draw, text):
    draw.text((650, 78), text.upper(), font=font(17, True), fill=CYAN)


def heading(draw, text, y=125, size=58):
    draw.multiline_text((648, y), text, font=font(size, True), fill=TEXT, spacing=4)


def body(draw, text, y, width=545, size=24):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textbbox((0, 0), trial, font=font(size))[2] <= width:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    draw.multiline_text((650, y), "\n".join(lines), font=font(size), fill=SOFT, spacing=9)


def pill(draw, x, y, label, value, accent):
    draw.rounded_rectangle((x, y, x + 170, y + 98), radius=18, fill=(13, 18, 30, 225), outline=(*accent, 80), width=2)
    draw.text((x + 18, y + 17), label.upper(), font=font(12, True), fill=accent)
    draw.text((x + 18, y + 45), value, font=font(30, True), fill=TEXT)


def footer(draw, index, label):
    draw.text((650, 666), f"0{index} / 04", font=font(14, True), fill=MUTED)
    draw.text((1228, 666), label.upper(), font=font(14, True), fill=MUTED, anchor="ra")
    draw.line((650, 642, 1228, 642), fill=(*CYAN, 65), width=2)


scenes = []

scene = base_canvas("agastya-casual.jpg", crop_shift=-28)
draw = ImageDraw.Draw(scene, "RGBA")
eyebrow(draw, "Meet Agastya / 52-second introduction")
heading(draw, "Strategy to\nshipped systems.", y=132, size=62)
body(draw, "Forward-deployed engineering across AI, data and cloud—built for secure production and measurable adoption.", 340)
draw.rounded_rectangle((650, 510, 1145, 566), radius=16, fill=(13, 18, 30, 205), outline=(*CYAN, 65), width=2)
draw.text((675, 538), "BUILDER  •  ARCHITECT  •  DELIVERY LEADER", font=font(16, True), fill=TEXT, anchor="lm")
footer(draw, 1, "Introduction")
scenes.append(scene)

scene = base_canvas("agastya-professional.jpg", crop_shift=-10)
draw = ImageDraw.Draw(scene, "RGBA")
eyebrow(draw, "Enterprise scale / Measurable outcomes")
heading(draw, "Built where\nimpact matters.", y=128, size=58)
body(draw, "A decade of engineering experience across regulated enterprises and high-scale digital platforms.", 295, size=23)
pill(draw, 650, 445, "Experience", "10+ yrs", CYAN)
pill(draw, 834, 445, "Scale", "50M+", VIOLET)
pill(draw, 1018, 445, "AI quality", "95%+", GREEN)
footer(draw, 2, "Track record")
scenes.append(scene)

scene = base_canvas("agastya-casual.jpg", crop_shift=-28)
draw = ImageDraw.Draw(scene, "RGBA")
eyebrow(draw, "Why forward-deployed engineering")
heading(draw, "Close to the problem.\nAccountable for\nthe outcome.", y=122, size=42)
body(draw, "The work starts with users and workflows, then stays accountable through architecture, production and adoption.", 330, size=22)
steps = [("01", "DISCOVER"), ("02", "SHAPE"), ("03", "BUILD"), ("04", "ADOPT")]
for position, (number, label) in enumerate(steps):
    x = 650 + position * 143
    draw.rounded_rectangle((x, 470, x + 129, 548), radius=16, fill=(13, 18, 30, 220), outline=(*CYAN, 50), width=1)
    draw.text((x + 14, 484), number, font=font(12, True), fill=CYAN)
    draw.text((x + 14, 516), label, font=font(15, True), fill=TEXT)
footer(draw, 3, "FDE mindset")
scenes.append(scene)

scene = base_canvas("agastya-professional.jpg", crop_shift=-10)
draw = ImageDraw.Draw(scene, "RGBA")
eyebrow(draw, "Engineering + product + executive clarity")
heading(draw, "Turn the idea into\na measurable outcome.", y=128, size=52)
body(draw, "Hands-on delivery, sound product judgment and clear stakeholder communication—from first conversation to systems that ship.", 320, size=23)
draw.rounded_rectangle((650, 508, 1040, 568), radius=16, fill=(*CYAN, 225))
draw.text((675, 538), "LET’S BUILD WHAT MATTERS", font=font(17, True), fill=BG, anchor="lm")
footer(draw, 4, "Let’s talk")
scenes.append(scene)

for index, scene in enumerate(scenes, start=1):
    scene.convert("RGB").save(OUTPUT / f"scene-{index}.png", optimize=True)

(ROOT / "assets" / "video").mkdir(parents=True, exist_ok=True)
scenes[0].convert("RGB").save(ROOT / "assets" / "video" / "elevator-pitch-poster.jpg", quality=90, optimize=True)
print(f"Created {len(scenes)} scenes in {OUTPUT}")
