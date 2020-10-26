# Can machine learning help compress clothing product images better?
\
&nbsp;&nbsp;&nbsp;&nbsp;We are confident that it can, and this small brochure/white-paper shows how. Broadly, computers represent images in two ways: either as vectors or as bitmaps. Clothing product images are generally of the later type: bitmaps, so for this exposition we focus on those only. 
For the computer, a bitmap image is a bidimensional array of pixels. Image compression is the process of reproducing a very similar copy of a master image in less bits. It works by doing one or both of two things. The first is exploiting redundancy in the input image. Pixels in an image tend to represent similar colors and values, which can be used to encode the image using fewer bits.

&nbsp;&nbsp;&nbsp;&nbsp;The second thing compression can do is to exploit peculiarities of the human visual system. It turns out humans do not see in pixels (unless we zoom an image a lot, which specialists on image processing do often), but in colors, light intensities and features. Image compression can result in an image which is not entirely faithful to the original, but whose defects the human eyes and brain don’t notice too much.

**Table 1** shows how different image compression formats exploit both things. Note that all formats exploit redundancy, but that lossless image formats do not try to trick the brain by “slipping in” artifacts that the human brain won’t notice.
![](https://i.ibb.co/y4t8dpQ/Annotation-2020-10-25-234729.png)

&nbsp;&nbsp;&nbsp;&nbsp;A third factor that influences image compression is processing time and complexity. Simply put, a compression/decompression operation must run quickly, often in the time scales relevant for in-browser rendering or onthe-flight encoding when serving a web page.
Rather than settling for the best, algorithms must often make “practical choices” which are suitable to the broadest variety of use cases.

## Tuning the algorithms to compress clothing pictures better
\
**What if instead of relying in the broad assumptions that algorithms like WebP compression do, we could rely in specifics for, say, compressing clothing pictures?**

&nbsp;&nbsp;&nbsp;&nbsp;To understand the potential in this technique, we show below a concept experiment with Gimp, a free program. You can download Gimp to repeat these experiments yourself with any image of your choosing. But before we get there, we must warn this is a proof of concept, nowhere near the output and the requisites a production system would be subject to. Consider it a fun way to see the concepts at play with readily available tools. After the experiment, we explain some of the adjustments that a real-world, implementation-level implementation would need.

&nbsp;&nbsp;&nbsp;&nbsp;The idea is the following: what happens when an image is applied Gaussian blur and then compressed? Figure 1 shows an image with two different backgrounds and their size under lossless compression. The first background is a rug, the second background is similar to the backgrounds are directors approve for use in their websites.

&nbsp;&nbsp;&nbsp;&nbsp;In both cases, Gaussian blur reduces the amount of information in an image. That loss of information is plainly visible in panels (b), (c), and (e) of the figure. Unsurprisingly, all the images with blur compress to lower sizes with lossless, as shown in Table 2. The gains in size are significant, but while the top sequence of panels make the background blurring clearly visible if one compares (a) vs (c), there is practically no visual difference in (d) vs (f), even if the resulting image is still 23% smaller.


<div style="display : inline-block;margin : 3% 3% 3%">
<img src="https://i.ibb.co/RCMNHBF/nc-sharp.webp"  width="25%"   >
<img src="https://i.ibb.co/5Fts7Bp/nc-flur-blurr.png"  width="25%"   >
<img src="https://i.ibb.co/ph4Gg9w/nc-partial-blurr.png"  width="25%"   >
<div>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[a]</b>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[b]</b>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[c]</b>

<div style="display : inline-block;margin : 3% 3% 3%">
<img src="https://i.ibb.co/tphs92q/nc-j-sharp.png"  width="25%"   >
<img src="https://i.ibb.co/Dr5kkhD/nc-j-full-blur.png"  width="25%"   >
<img src="https://i.ibb.co/52NTtz0/nc-j-partial-blur.png"  width="25%"   >
<div>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[d]</b>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[e]</b>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[f]</b>

\
**Figure 1:** Image background and impact in compression cost. Panel (a) represents an image with a non-trivial background. Panel (b) shows the same image with Gaussian blur applied. Panel ( c ) is a composition of (a) and (b) ``where only the background has been blurred``. Panel (d), (e) and (f) mirror (a ), (b) and ( c ) but with a different background.

| Image | Lossless PNG size (kilobytes) | Lossless WebP size (kilobytes)
| - | - | -
| Input image: <br> (a) Girl with rug as background, <br>(d) Girl with photographic background | 548 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (a) <br> 259 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (d) | 363 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (a) <br> 159 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (d)
| Experiment 1: full blur, panes (b) and (e) | 276 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (b) <br> 143 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (e) | 189 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (b) <br> &nbsp; 97 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (e)
| Experiment 2: blur in backgroundonly, panes (c) and (f) | 280 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (c) <br> 193 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (f) | 185 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (c) <br> 126 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (f)

**Table 2:** ``Size in kilobytes of the images in Figure 1, compressed with both PNG and WebP lossless. Both compression formats should by definition be able to reproduce the same image, pixel by pixel that they are provided as input, therefore the sizes in this tables reflect the power of the compression algorithms.``

**Can one use these results for clothing products?** 
Yes, blurring the backgrounds does not have a visual impact in some images, as the second sequence of images shows. Better, even for non-trivial backgrounds like the one in the first image sequence, we are convinced that smart trade-offs are possible.

&nbsp;&nbsp;&nbsp;&nbsp;Another way to look at these results it is that blurring reduces the amount of “surprise” that compression algorithms find in the image (information entropy). Since the conventional compression algorithms are tuned for general images, things like clothing texture and photographic pixel noise are treated equally. However, one can improve the results just by separating both.

## Challenges and machine learning
Machine learning help us solve many practical challenges with the approach summarized above:
- We need robust, automated ways to find the parts of the image which are interesting for an e-commerce operator, i.e. cloth and skin texture, so that we can dedicate more bits to those areas than to the background.
- In the toy example above, we gave the results using lossless compression algorithms. But in practice clothing product images are compressed with lossy formats, where one needs to control by visual distortion, and unsurprisingly, humans perceive distortion in clothing and skin textures different than they perceive distortion in background noise. Machine learning help us replicate human perception for grading image quality.
- Using Gaussian blur, as we did in the toy example, is not necessarily optimal. Machine learning help us find filters that perform optimally under certain compression algorithms.
