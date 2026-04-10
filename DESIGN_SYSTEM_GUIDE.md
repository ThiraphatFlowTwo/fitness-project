# Design System Guide - ระบบจัดการเทรนเนอร์

## ภาพรวมการ (Overview)

ระบบนี้ใช้ Color System ที่ออกแบบมาและทันสมัย เพื่อสร้างประสบการภาพ (Visual Hierarchy) ที่ชัดเจนและเป็นมืออาชีพ

---

## 🎨 Color System (ระบบสี)

### Primary Colors (สีหลัก)

#### Deep Navy Blue (ความมั่นคง) - Primary
- **Purpose**: หัวข้อ ส่วนที่สำคัญ และปุ่มหลัก (Primary elements, headings, navigation)
- **Usage**:
  - Navigation elements
  - Primary buttons
  - Section headers
  - Card borders
  - Icon backgrounds

**Tailwind Classes:**
```jsx
// Backgrounds
bg-navy-900      // Deepest navy - main headings, primary buttons
bg-navy-800      // Dark navy - secondary headings
bg-navy-700      // Medium navy - card icons, gradients
bg-navy-100      // Light navy - active states, backgrounds

// Text
text-navy-900     // Primary headings
text-navy-700     // Secondary text, icons
```

#### Steel Grey (ความทันสมัย) - Secondary
- **Purpose**: สีรอง (Secondary elements, backgrounds, ข้อความ)
- **Usage**:
  - Page backgrounds
  - Form backgrounds
  - Secondary text
  - Borders

**Tailwind Classes:**
```jsx
// Backgrounds
bg-steel-50      // Lightest - page backgrounds
bg-steel-100     // Very light - hover states
bg-steel-200     // Light - borders, dividers

// Text
text-steel-500     // Subtitles, labels
text-steel-600     // Body text
text-gray-500      // Form labels, muted text
text-gray-600      // Secondary text
```

#### Sky Blue (ความสดใส/สุขภาพดี) - Accent
- **Purpose**: สีเน้น (Accent elements, highlights, interactive states)
- **Usage**:
  - Active states
  - Hover effects
  - Icons
  - Success indicators
  - Links

**Tailwind Classes:**
```jsx
// Backgrounds
bg-sky-500       // Primary accent - buttons, highlights
bg-sky-600       // Darker accent - hover states
bg-sky-100       // Light accent - backgrounds

// Text
text-sky-600      // Accent text, links
```

### Status Colors (สีแสดงสถานะ)

#### Success (สำเร็จ) - Emerald
```jsx
bg-emerald-500        // Primary success
bg-emerald-600        // Hover success
text-emerald-600       // Success text
bg-emerald-100       // Success badge background
```

#### Warning (คำเตือน) - Yellow
```jsx
bg-yellow-500          // Warning background
text-yellow-600         // Warning text
bg-yellow-100          // Warning badge background
```

#### Error (ผิดพลาด) - Red
```jsx
bg-red-500            // Error/danger
text-red-600           // Error text
bg-red-100            // Error badge background
```

---

## 🎨 Color Palette (ตารางสี)

### Navy Color Scale
```
navy-50   : #f0f4f8  // พื้นที่เบามาก
navy-100  : #d9e2ec  // Active state background
navy-200  : #bcccdc  // Divider
navy-300  : #9fb3c8  // Icon hover
navy-400  : #829ab1  // Icon default
navy-500  : #627d98  // Text secondary
navy-600  : #486581  // Text body
navy-700  : #334e68  // Icons, borders
navy-800  : #243b53  // Headers secondary
navy-900  : #102a43  // Headings primary
navy-950  : #0a1629  // Active states
```

### Steel Color Scale
```
steel-50   : #F5F7FA  // Page backgrounds
steel-100  : #e9ecef  // Hover backgrounds
steel-200  : #dee2e6  // Borders
steel-300  : #ced4da  // Subtle
steel-400  : #adb5bd  // Secondary text
steel-500  : #6c757d  // Body text
steel-600  : #495057  // Body text
steel-700  : #343a40  // Dark text
steel-800  : #212529  // Very dark text
steel-900  : #0d1117  // Black equivalent
```

### Sky Color Scale
```
sky-50    : #e0f2fe  // Very light accent
sky-100   : #bae6fd  // Light accent
sky-200   : #7dd3fc  // Medium accent
sky-300   : #38bdf8  // Bright accent
sky-400   : #0ea5e9  // Primary accent
sky-500   : #0284c7  // Button accent
sky-600   : #0369a1  // Hover accent
sky-700   : #075985  // Dark accent
sky-800   : #0c4a6e  // Very dark
sky-900   : #082f49  // Deepest accent
```

---

## 🧩 Component Styles (รูปแบบ Component)

### Buttons (ปุ่ม)

#### Primary Button
```jsx
<button className="bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
  เนื้อหา
</button>
```

#### Action Button
```jsx
<button className="bg-white border border-gray-200 hover:border-navy-900 hover:bg-navy-50 text-navy-900 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
  ดำเนินการ
</button>
```

#### Success Button
```jsx
<button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200">
  บันทึก
</button>
```

#### Danger Button
```jsx
<button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
  ลบ
</button>
```

### Cards (การ์ด)

#### Section Card
```jsx
<div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 border border-gray-200 hover:-translate-y-1 transition-all duration-200">
  {/* Content */}
</div>
```

#### Card with Border Accent
```jsx
<div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 border border-gray-200 border-l-4 border-l-navy-900 hover:-translate-y-1 transition-all duration-200">
  {/* Content */}
</div>
```

### Forms (ฟอร์ม)

#### Input Field
```jsx
<div className="relative">
  <input
    placeholder="กรอกข้อมูล"
    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
  />
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
</div>
```

#### Input with Error
```jsx
<input
  className="w-full px-4 py-3 bg-gray-50 border border-red-500 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none ring-2 ring-red-500"
/>
<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
  <XCircle className="w-4 h-4" />
  {error}
</p>
```

#### Select Field
```jsx
<select
  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
>
  <option value="">-- เลือก --</option>
  <option value="value">Label</option>
</select>
```

### Navigation (การนำทาง)

#### Sidebar Item - Active
```jsx
<button className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden bg-navy-100 text-navy-900">
  <Icon className="w-5 h-5 text-navy-700 relative z-10 transition-transform duration-200 group-hover:scale-110" />
  <span className="relative z-10 flex-1 font-medium text-left">เมนู</span>
</button>
```

#### Sidebar Item - Inactive
```jsx
<button className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-navy-900 hover:bg-gray-100">
  <Icon className="w-5 h-5 text-navy-700 relative z-10 transition-transform duration-200 group-hover:scale-110" />
  <span className="relative z-10 flex-1 font-medium text-left">เมนู</span>
</button>
```

### Badges (แบดจ์)

#### Status Badge
```jsx
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">
  <CheckCircle className="w-3 h-3" />
  Active
</span>
```

---

## 📐 Typography (รูปแบบตัวอักษร)

### Font Sizes (ขนาดตัวอักษร)

```jsx
text-xs      // 0.75rem   - Labels, badges, meta
text-sm      // 0.875rem  - Body text, descriptions
text-base    // 1rem      - Body text
text-lg      // 1.125rem  - Headings
text-xl      // 1.25rem   - Headings
text-2xl     // 1.5rem    - Page titles
text-3xl     // 1.875rem  - Hero titles
text-4xl     // 2.25rem   - Large displays
```

### Font Weights (ความหนา)
```jsx
font-normal      // Regular text
font-medium      // Subheadings, emphasis
font-semibold    // Primary headings, labels
font-bold        // Section headings
font-extrabold  // Hero titles, main headings
```

### Text Colors (สีตัวอักษร)

```jsx
text-navy-900     // Primary headings
text-navy-700     // Secondary headings, icons
text-navy-600     // Body text emphasis
text-gray-600      // Body text
text-gray-500      // Labels, subtitles
text-gray-400      // Muted text, placeholders
text-sky-600      // Accent text, links
text-emerald-600   // Success text
text-yellow-600     // Warning text
text-red-600        // Error text
```

---

## 🎯 Spacing (ระยะห่าง)

### Padding (ช่องว่างด้านใน)
```jsx
p-2   // Very small
p-3   // Small - buttons, inputs
p-4   // Medium - cards
p-6   // Large - sections
p-8   // Extra large - containers
```

### Margin (ช่องว่างด้านนอก)
```jsx
m-2   // Very small
m-4   // Small
m-6   // Medium - sections
m-8   // Large - containers
```

### Gap (ระยะห่างระหว่าง)
```jsx
gap-2   // Very small
gap-3   // Small
gap-4   // Medium - grids
gap-6   // Large - sections
```

---

## 🔲 Borders (เส้นขอบ)

```jsx
border          // Default border
border-gray-200  // Light gray border
border-navy-700  // Navy accent border
border-l-4     // Left border thick
border-t        // Top border
border-b        // Bottom border
rounded-xl      // Extra rounded
rounded-2xl     // Extra extra rounded
```

---

## 💫 Shadows (เงา)

```jsx
shadow-sm      // Small shadow - cards, buttons
shadow-md      // Medium shadow - cards, buttons
shadow-lg      // Large shadow - modals, dropdowns
shadow-xl      // Extra large shadow - hero sections
shadow-navy    // Navy tinted shadow
shadow-glow     // Glow effect (custom)
```

---

## ✨ Transitions & Animations (เอฟเฟกต์และ Animation)

### Duration (ระยะเวลา)
```jsx
duration-75     // Very fast
duration-150    // Fast
duration-200    // Medium - hover effects
duration-300    // Slow - layout changes
```

### Transition Properties (คุณสมพอเตอร์)
```jsx
transition-all      // All properties
transition-colors   // Only colors
transition-transform  // Only transform
```

### Transform Effects (ผลเอฟเฟกต์)
```jsx
hover:-translate-y-1  // Lift up on hover
hover:scale-105        // Scale up slightly
hover:scale-110        // Scale up more
active:scale-105        // Scale when active
```

---

## 🎯 Layout Patterns (รูปแบบ Layout)

### Grid System (ระบบ Grid)
```jsx
grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
```

### Flex Layout (ระบบ Flex)
```jsx
flex flex-col sm:flex-row justify-between items-center gap-4
```

### Container (คอนเทนเนอร์)
```jsx
<div className="max-w-7xl mx-auto px-6">
  {/* Content */}
</div>
```

### Page Wrapper (หน้าเว็บ)
```jsx
<div className="min-h-screen bg-steel-50 p-4 sm:p-6 lg:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Page content */}
  </div>
</div>
```

---

## ♿ Accessibility (การเข้าถึงง่าย)

### Contrast Requirements (ความต่างสี)
- **Text on light backgrounds**: Use `text-navy-900` or `text-gray-600`
- **Text on dark backgrounds**: Use `text-white` or `text-gray-200`
- **Borders**: Use `border-gray-200` on light, `border-white/20` on dark
- **Minimum contrast**: Ensure at least 4.5:1 ratio

### Focus States (สถานะ Focus)
```jsx
focus:ring-2 focus:ring-sky-500 focus:border-transparent
```

### Hover States (สถานะ Hover)
```jsx
hover:bg-gray-100  // Light backgrounds
hover:border-navy-900  // Darker borders
hover:shadow-lg     // More prominent
hover:-translate-y-1  // Lift effect
```

---

## 📝 Best Practices (แนวทปฏิบัตน

### 1. Consistency (ความสมาน)
- ✅ เลือกสีจาก Design System เท่านั้น
- ✅ ใช้ spacing เดียวกัน (p-6, gap-6)
- ✅ เลือก rounded corners เดียวกัน (rounded-xl, rounded-2xl)

### 2. Hierarchy (ลำดับชั้น)
- ✅ Headings: `text-navy-900 font-semibold` or `font-bold`
- ✅ Body: `text-gray-600`
- ✅ Labels: `text-gray-500`
- ✅ Accent: `text-sky-600` สำหรับ links และ interactive elements

### 3. Visual Depth (ความลึกชึ้)
- ✅ ใช้ shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- ✅ เพิ่ม hover effects: `hover:shadow-lg`, `hover:-translate-y-1`
- ✅ ใช้ gradients: `from-navy-900 to-navy-800` สำหรับ buttons

### 4. Interactive States (สถานะ Interactive)
- ✅ Add hover effects: `hover:bg-gray-100`, `hover:scale-105`
- ✅ Add focus states: `focus:ring-2 focus:ring-sky-500`
- ✅ Active states: `bg-navy-100`, `text-navy-900`

### 5. Spacing (ระยะห่าง)
- ✅ ใช้ consistent spacing: `gap-4` สำหรับ grid, `gap-6` สำหรับ sections
- ✅ ให้ whitespace เพียงพอ: `p-6` ไม่ cramped
- ✅ Group related elements: ใช้ spacing ระหว่างเดียวกัน

---

## 🔧 Usage Examples (ตัวอย่างการใช้งาน)

### Dashboard Card
```jsx
<div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 border border-gray-200 hover:-translate-y-1 transition-all duration-200">
  <div className="flex items-center gap-3 mb-4">
    <div className="h-8 w-8 bg-gradient-to-br from-navy-900 to-navy-700 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-navy-900">จัดการด่วน</h2>
  </div>
  {/* Content */}
</div>
```

### Navigation Menu
```jsx
<button className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-navy-900 hover:bg-gray-100">
  <Icon className="w-5 h-5 text-navy-700 group-hover:scale-110 transition-transform duration-200" />
  <span className="flex-1 font-medium">เมนู</span>
  <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
</button>
```

### Form Input
```jsx
<div className="relative">
  <label className="block text-sm font-semibold text-navy-900 mb-2 flex items-center gap-2">
    <Icon className="w-4 h-4 text-navy-700" />
    ชื่อฟิลด์
  </label>
  <input
    placeholder="กรอกข้อมูล"
    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
  />
  {error && (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <XCircle className="w-4 h-4" />
      {error}
    </p>
  )}
</div>
```

### Status Badge
```jsx
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">
  <CheckCircle className="w-3 h-3" />
  Active
</span>
```

---

## 📚 Component Library (ไลบรารี่ Component)

### Reusable Components Created:
1. **PageContainer** - Page wrapper with consistent spacing
2. **SectionCard** - Section card with optional header
3. **StatCard** - Statistics display card
4. **QuickAction** - Action card with hover effects
5. **ActivityItem** - Activity feed item
6. **StatusItem** - Status display item
7. **InfoCard** - Information display card

---

## 🚀 Getting Started (เริ่มต้นใช้งาน)

### 1. Import Components
```jsx
import { PageContainer } from "../../components/ui/layout/PageContainer";
import { SectionCard } from "../../components/ui/cards/SectionCard";
import { StatCard } from "../../components/ui/cards/StatCard";
import { QuickAction } from "../../components/ui/cards/QuickAction";
```

### 2. Apply Design System
```jsx
<PageContainer>
  <div className="space-y-6">
    {/* Use consistent spacing */}
    <SectionCard title="ส่วนหัวข้อ">
      {/* Use consistent card style */}
    </SectionCard>
  </div>
</PageContainer>
```

### 3. Test for Accessibility
- ✅ Check color contrast
- ✅ Test keyboard navigation
- ✅ Verify focus states
- ✅ Test on different screen sizes

---

## 📞 Troubleshooting (การแก้ไขปัญหา)

### Common Issues:

**❌ Icons not visible**
```jsx
// ผิด
<Icon className="w-5 h-5 text-steel-300" />

// ถูก
<Icon className="w-5 h-5 text-navy-700" />
```

**❌ Low contrast text**
```jsx
// ผิด
<p className="text-gray-300">ข้อความ</p>

// ถูก
<p className="text-gray-600">ข้อความ</p>
```

**❌ Inconsistent colors**
```jsx
// ผิด - Random colors
bg-gradient-to-r from-blue-500 to-indigo-600

// ถูก - Use Design System colors
bg-gradient-to-r from-navy-900 to-navy-800
```

---

## 📞 Resources (แหล่งทรัพย์)

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**หมายเหตุ**: Design System นี้ถูกออกแบบมาเพื่อให้ UI/UX ที่สม่ำเสมอภาพ (Visual Consistency) และเป็นมืออาชีพมากข้น
