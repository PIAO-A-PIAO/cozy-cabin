# COZY CABIN — MASTER ASSET GENERATION PROMPT

Create a standalone 2D illustrated game asset for **Cozy Cabin**, a warm, peaceful virtual study room.

The asset will eventually be composited with other independently generated assets to form one complete interactive room scene.

## STYLE REFERENCES

Use all provided Cozy Cabin reference images as the **primary visual style references**.

The new asset must look as though it was illustrated by the **same artist, for the same game, using the same drawing and painting techniques**.

Use the reference images to match:

* linework
* outline weight
* color treatment
* painted texture
* shading
* shape language
* perspective language
* level of detail
* overall softness and visual simplicity

Do not reproduce or include objects from the reference images unless explicitly requested in the Asset Specification.

The reference images define the visual style more strongly than generic interpretations of terms such as "cozy," "storybook," or "hand-painted."

If any general style instruction conflicts with the appearance of the provided Cozy Cabin references, **prioritize consistency with the reference images**.

---

# VISUAL STYLE

Use a **clean hand-painted 2D game illustration style** with a subtle gouache and watercolor quality.

The illustration should have:

* thin-to-medium warm dark-brown hand-drawn outlines
* slightly irregular and organic linework
* softly rounded shapes
* subtle painted color variation
* restrained watercolor/gouache-like texture
* simple and immediately readable forms
* soft internal shading
* warm, muted colors
* medium-low visual complexity

The asset should feel:

* warm
* peaceful
* handmade
* slightly nostalgic
* gently imperfect
* comfortable and lived-in

It should feel charming without becoming childish or overly cartoonish.

Avoid:

* photorealism
* 3D rendering
* pixel art
* anime styling
* chibi styling
* flat vector graphics
* glossy mobile-game rendering
* highly polished digital concept art
* heavy texture
* dramatic cinematic lighting
* thick black cartoon outlines
* perfectly geometric vector-like shapes

---

# LINEWORK

Use **warm dark-brown outlines**, never pure black.

Lines should be slightly irregular and organic, as though drawn by hand.

Outer silhouettes may use slightly stronger lines, while internal details should use thinner or softer lines.

Avoid extremely clean vector lines or loose unfinished sketch lines.

Match the line weight of the provided Cozy Cabin reference assets.

---

# COLOR PALETTE

Use a **warm, muted, low-to-medium saturation palette** consistent with the reference images.

Typical Cozy Cabin colors may include:

* warm cream
* ivory
* oatmeal
* beige
* light natural wood
* medium wood brown
* dark warm brown
* muted terracotta
* dusty orange
* muted sage
* forest green
* warm gray
* aged brass
* faded red
* mustard
* desaturated blue

Not every asset needs to use all of these colors.

Choose only colors appropriate for the requested object while keeping them harmonious with the existing Cozy Cabin assets.

Avoid:

* neon colors
* highly saturated colors
* pure white
* pure black
* glossy chrome
* strong artificial gradients

Use subtle differences in value and hue so that adjacent objects remain visually distinguishable when composited together.

---

# PAINTING AND TEXTURE

Use restrained handmade surface variation.

Suitable treatment includes:

* gentle gouache-like color variation
* subtle watercolor softness
* faint brush texture
* restrained highlights
* soft painted shading
* small natural imperfections

Do not render excessive material detail.

Do not use heavy paper grain, strong noise, distressed textures, or photorealistic surface rendering.

The asset must remain visually clear when displayed relatively small in a web interface.

---

# SHAPE LANGUAGE

Favor:

* rounded corners
* softened rectangular forms
* gentle curves
* sturdy proportions
* slightly imperfect handmade geometry
* clear silhouettes

Objects should feel practical, personal, and well cared for.

Avoid overly futuristic, luxurious, sterile, sharp, industrial, or aggressively minimalist design unless specifically required by the Asset Specification.

---

# LEVEL OF DETAIL

Use **medium-low visual complexity**, matching the existing Cozy Cabin reference assets.

Include enough detail to make the object recognizable and charming, but avoid unnecessary decoration.

Prioritize:

1. recognizable silhouette
2. functional identity
3. visual readability at small size
4. consistency with existing assets
5. decorative details

Remember that many independently generated assets will eventually appear together in one room.

No individual asset should become disproportionately detailed compared with the others.

---

# PERSPECTIVE AND CAMERA LANGUAGE

All assets belong to the same Cozy Cabin room and must share a compatible camera language.

The overall scene uses a **mostly frontal view with a gentle elevated viewing angle**.

However, do not force every object into exactly the same viewing angle.

Instead, use the object's natural placement in the room to determine its local viewing angle.

For example:

* upright tabletop objects should generally be mostly frontal with a small amount of their top surface visible
* furniture should use a mostly frontal perspective with enough top surface visible to support composited objects
* flat objects lying on a tabletop may use a more elevated angle so their surfaces remain visible
* objects resting on the floor may use a gentle downward viewing angle
* wall-mounted objects should generally appear close to frontal

The result should look physically believable when all assets are composited into the same room.

Avoid:

* strong isometric perspective
* dramatic three-quarter views
* fisheye distortion
* cinematic camera angles
* extreme perspective distortion

Consistency of the **overall camera environment** is more important than forcing identical rotation onto every object.

---

# LIGHTING

Use **soft, diffuse, warm ambient lighting**.

Lighting should be neutral enough for the asset to coexist with different future window conditions, including:

* sunny daytime
* cloudy weather
* rain
* snow
* sunset
* nighttime

Use subtle internal shading to establish form.

Avoid:

* strong directional sunlight
* dramatic cast shadows
* rim lighting
* strong reflections
* intense highlights
* glowing environmental effects

Do not bake a specific time of day into the asset unless explicitly requested.

---

# INTERACTIVE GAME ASSET REQUIREMENT

This object may eventually function as an interactive element in a web application.

Its silhouette and important functional features must remain recognizable when the asset is displayed at a relatively small size.

Do not rely on tiny decorative details to communicate the object's purpose.

If the object will be clickable, its major visual form should provide a clear and generous interaction area.

---

# DYNAMIC UI SURFACE RULE

If the Asset Specification identifies part of the object as a future dynamic UI surface — such as:

* a digital display
* board
* screen
* frame
* sign
* window
* panel

— keep that surface visually simple and geometrically predictable.

Such surfaces should generally be:

* close to front-facing
* clearly bounded
* unobstructed
* free of baked-in text
* free of unnecessary texture
* free of strong highlights
* free of perspective distortion when possible

Dynamic information will later be rendered using HTML/CSS or another independent visual layer.

Do not generate permanent UI content inside these areas unless explicitly requested.

---

# TEXT RULE

Do not generate readable text unless explicitly requested.

Avoid:

* labels
* logos
* brand names
* handwritten messages
* random AI-generated words
* unnecessary numbers

If markings are visually necessary, use simple abstract lines, ticks, or non-readable decorative marks.

---

# BACKGROUND AND CUTOUT REQUIREMENT

Generate the asset against a **perfectly flat, solid chroma-key green background (#00FF00)**.

The entire background must use one single uniform green color.

The green background is temporary and will be removed during post-production to create a transparent PNG.

Therefore:

* use exactly one flat background color
* no checkerboard transparency pattern
* no simulated transparency
* no background texture
* no gradient
* no vignette
* no scenery
* no floor
* no wall
* no horizon
* no environmental background lighting variation
* no background shadows
* no green reflected light on the asset

Keep the requested asset visually separated from the green background with a clean, clearly defined silhouette.

**Do not use chroma-key green anywhere inside the asset itself.**

Do not add an external cast shadow onto the green background.

Show the complete asset without cropping and leave comfortable green space around all edges.

The background must be **actual solid #00FF00 green**, not a transparency checkerboard and not an illustration of a green screen.

### Alternative Background Rule

If the requested asset itself contains significant green colors that could interfere with chroma-key removal, replace the green background with a **perfectly flat solid chroma-key magenta background (#FF00FF)**.

Apply all of the same background requirements.

Do not use chroma-key magenta anywhere inside an asset generated against the magenta background.

---

# ASSET ISOLATION

Generate **only the requested asset**.

Unless explicitly requested in the Asset Specification, do not include:

* furniture from reference images
* room backgrounds
* walls
* floors
* windows
* unrelated props
* decorative scenery
* additional objects
* environmental cast shadows

Show the entire requested asset without cropping.

Leave comfortable chroma-key background space around all edges.

Internal shading and natural overlap between components belonging to the requested asset are allowed.

---

# COHESION REQUIREMENT

The most important requirement is **visual consistency with the provided Cozy Cabin reference images**.

When the new asset is cut out and composited together with the existing Cozy Cabin assets, the result should immediately look like one coherent illustrated game environment.

Every asset should appear to have been:

* illustrated by the same artist
* created for the same game
* painted with the same materials
* designed with the same visual language
* viewed through the same overall camera system

Do not introduce a new visual style simply because the requested asset belongs to a different category.

For example, characters, furniture, electronics, paper objects, plants, and decorations should all retain the same Cozy Cabin visual language.

**Consistency is more important than making an individual asset unusually elaborate.**

When uncertain, choose the simpler, warmer, softer, and more handmade interpretation.

---

# ASSET SPECIFICATION

**Asset Name:**
[INSERT ASSET NAME]

**Object Description:**
[DESCRIBE WHAT THE OBJECT IS, ITS MAIN SHAPE, MATERIALS, COLORS, AND IMPORTANT VISUAL FEATURES.]

**Placement in the Room:**
[DESCRIBE WHERE THE ASSET WILL APPEAR: ON THE DESK, UNDER THE DESK, ON THE WALL, ON THE WINDOWSILL, BESIDE THE DESK, ETC.]

**Approximate Orientation:**
[DESCRIBE WHETHER IT SHOULD BE MOSTLY FRONT-FACING, LYING FLAT, SLIGHTLY TURNED, ETC.]

**Interactive Purpose:**
[DESCRIBE WHAT HAPPENS WHEN THE USER INTERACTS WITH IT, OR WRITE "DECORATIVE ONLY".]

**Dynamic UI Surface:**
[DESCRIBE ANY AREA THAT MUST REMAIN BLANK FOR FUTURE HTML/CSS CONTENT, OR WRITE "NONE".]

**Required Details:**

* [DETAIL 1]
* [DETAIL 2]
* [DETAIL 3]

**Do Not Include:**

* [UNWANTED ELEMENT 1]
* [UNWANTED ELEMENT 2]
* [UNWANTED ELEMENT 3]

**Scale / Visual Importance:**
[DESCRIBE WHETHER THIS IS A LARGE FURNITURE PIECE, MEDIUM OBJECT, SMALL TABLETOP OBJECT, SUBTLE DECORATION, ETC.]

Follow the Cozy Cabin Master Asset Generation Guide above exactly.

Prioritize visual consistency with the provided Cozy Cabin reference images over introducing new stylistic interpretations.
