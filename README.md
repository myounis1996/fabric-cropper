# Fabric.js Image Cropper

A modern, responsive image cropping tool built with Fabric.js. Crop, resize, and edit images with precision directly in your browser - no registration required!

🌐 **Live Demo**: [https://fabric-cropper.web.app](https://fabric-cropper.web.app)

## ✨ Features

- **🎯 Precise Cropping**: Drag and resize crop area with pixel-perfect precision
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🖼️ Multiple Upload Options**: 
  - Drag & drop images
  - Click to upload
  - Choose from sample images
- **📐 Dimension Controls**: Set exact width and height values
- **🎨 Visual Feedback**: Grid lines, overlay mask, and handle controls
- **💾 Export Options**: Save cropped images as PNG files
- **⚡ Fast & Lightweight**: Built with modern web technologies
- **🔒 Privacy-First**: All processing happens in your browser

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/myounis1996/fabric-cropper.git
   cd fabric-cropper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Deploy to Firebase

```bash
npm run deploy
```

## 🛠️ Usage

### Basic Cropping

1. **Upload an Image**
   - Drag and drop an image onto the upload area
   - Or click "Choose File" to select from your device
   - Or select one of the sample images

2. **Adjust Crop Area**
   - Drag the crop rectangle to move it
   - Use the corner handles to resize
   - Use the dimension inputs for precise sizing

3. **Apply Crop**
   - Click the "✂️ Crop" button to apply the crop
   - The cropped image will replace the original

4. **Save Image**
   - Click "💾 Save PNG" to download the cropped image

### Settings

- **Reset**: Click "↺ Reset" to restore the original crop area
- **Precise Dimensions**: Enter exact width and height values in the input fields
- **Responsive Canvas**: The canvas automatically adjusts to fit your screen

## 🏗️ Project Structure

```
fabric-cropper/
├── src/
│   ├── canvas/
│   │   ├── CanvasManager.js      # Canvas initialization and management
│   │   ├── CropperBox.js         # Main cropping functionality
│   │   └── cropper/
│   │       ├── Bounds.js         # Boundary checking
│   │       ├── GridLines.js      # Grid overlay
│   │       ├── Handles.js        # Resize handles
│   │       ├── OverlayMask.js    # Dark overlay outside crop area
│   │       └── index.js          # Cropper utilities
│   ├── ui/
│   │   ├── CropSettingsPanel.js  # Crop controls and settings
│   │   └── ImageUploadPanel.js   # Image upload interface
│   └── styles/
│       ├── main.css              # Main stylesheet
│       ├── layout.css            # Layout styles
│       ├── crop-panel.css        # Crop panel styles
│       ├── upload-panel.css      # Upload panel styles
│       └── responsive.css        # Responsive design
├── public/
│   ├── images/                   # Sample images
│   └── icons/                    # App icons
├── index.html                    # Main HTML file
├── index.js                      # Application entry point
└── package.json                  # Dependencies and scripts
```

## 🛠️ Technologies Used

- **Fabric.js** - Canvas manipulation and image processing
- **Vite** - Fast build tool and development server
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Firebase Hosting** - Production deployment

## 🎨 Key Components

### CanvasManager
Handles canvas initialization, resizing, and responsive behavior.

### CropperBox
Core cropping functionality with:
- Interactive crop rectangle
- Grid overlay
- Resize handles
- Boundary constraints
- Overlay mask

### CropSettingsPanel
User interface for:
- Dimension inputs
- Crop/reset/save buttons
- Real-time dimension updates

### ImageUploadPanel
Image upload interface with:
- Drag & drop support
- File picker
- Sample images
- Loading states

## 🔧 Configuration

### Customization Options

You can customize the cropper by modifying these files:

- **Colors**: Edit `src/styles/variables.css`
- **Canvas Size**: Modify `CanvasManager.js` resize logic
- **Grid Style**: Update `GridLines.js`
- **Handle Appearance**: Customize `Handles.js`

### Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📱 Responsive Design

The cropper automatically adapts to different screen sizes:
- **Desktop**: Full-featured interface with all controls
- **Tablet**: Optimized touch controls
- **Mobile**: Simplified interface with essential features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) - Powerful canvas library
- [Vite](https://vitejs.dev/) - Fast build tool
- Sample images from [Pexels](https://pexels.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/myounis1996/fabric-cropper/issues)
- **Demo**: [https://fabric-cropper.web.app](https://fabric-cropper.web.app)
- **Author**: [myounis1996](https://github.com/myounis1996)

---

⭐ **Star this repository if you find it helpful!** 