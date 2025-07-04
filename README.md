
```
misionary
├─ backend
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  ├─ src
│  │  ├─ config
│  │  │  ├─ config.ts
│  │  │  └─ prisma.ts
│  │  ├─ controllers
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ factura.controller.ts
│  │  │  ├─ persona.controller.ts
│  │  │  ├─ presupuesto.controller.ts
│  │  │  └─ producto.controller.ts
│  │  ├─ index.ts
│  │  ├─ middleware
│  │  │  ├─ auth.ts
│  │  │  ├─ checkRole.ts
│  │  │  └─ error.ts
│  │  ├─ routes
│  │  │  ├─ auth.routes.ts
│  │  │  ├─ factura.routes.ts
│  │  │  ├─ persona.routes.ts
│  │  │  ├─ presupuesto.routes.ts
│  │  │  └─ producto.routes.ts
│  │  ├─ services
│  │  │  ├─ factura.service.ts
│  │  │  ├─ persona.service.ts
│  │  │  ├─ presupuesto.service.ts
│  │  │  └─ producto.service.ts
│  │  └─ utils
│  │     ├─ http-error.ts
│  │     └─ validator.ts
│  └─ tsconfig.json
├─ docker-compose.yml
└─ frontend
   ├─ .eslintignore
   ├─ .eslintrc.cjs
   ├─ .prettierignore
   ├─ .prettierrc
   ├─ Dockerfile
   ├─ README.md
   ├─ index.html
   ├─ nginx.conf
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.cjs
   ├─ public
   │  ├─ data
   │  │  ├─ features.json
   │  │  ├─ order-list.csv
   │  │  ├─ product-list.csv
   │  │  └─ unemployment-by-county-2017.csv
   │  ├─ favicon.ico
   │  ├─ img
   │  │  ├─ avatars
   │  │  │  ├─ thumb-1.jpg
   │  │  │  ├─ thumb-10.jpg
   │  │  │  ├─ thumb-11.jpg
   │  │  │  ├─ thumb-12.jpg
   │  │  │  ├─ thumb-13.jpg
   │  │  │  ├─ thumb-14.jpg
   │  │  │  ├─ thumb-15.jpg
   │  │  │  ├─ thumb-16.jpg
   │  │  │  ├─ thumb-2.jpg
   │  │  │  ├─ thumb-3.jpg
   │  │  │  ├─ thumb-4.jpg
   │  │  │  ├─ thumb-5.jpg
   │  │  │  ├─ thumb-6.jpg
   │  │  │  ├─ thumb-7.jpg
   │  │  │  ├─ thumb-8.jpg
   │  │  │  └─ thumb-9.jpg
   │  │  ├─ countries
   │  │  │  ├─ ar.png
   │  │  │  ├─ cn.png
   │  │  │  ├─ fr.png
   │  │  │  ├─ jp.png
   │  │  │  ├─ sp.png
   │  │  │  └─ us.png
   │  │  ├─ logo
   │  │  │  ├─ logo-dark-full.png
   │  │  │  ├─ logo-dark-streamline.png
   │  │  │  ├─ logo-light-full.png
   │  │  │  └─ logo-light-streamline.png
   │  │  ├─ others
   │  │  │  ├─ auth-cover-bg.jpg
   │  │  │  ├─ auth-side-bg.jpg
   │  │  │  ├─ docs
   │  │  │  │  ├─ blank-dark.jpg
   │  │  │  │  ├─ blank.jpg
   │  │  │  │  ├─ classic-dark.jpg
   │  │  │  │  ├─ classic.jpg
   │  │  │  │  ├─ decked-dark.jpg
   │  │  │  │  ├─ decked.jpg
   │  │  │  │  ├─ modern-dark.jpg
   │  │  │  │  ├─ modern.jpg
   │  │  │  │  ├─ simple-dark.jpg
   │  │  │  │  ├─ simple.jpg
   │  │  │  │  ├─ stackedSide-dark.jpg
   │  │  │  │  └─ stackedSide.jpg
   │  │  │  ├─ img-1.jpg
   │  │  │  ├─ img-10.png
   │  │  │  ├─ img-11.jpg
   │  │  │  ├─ img-13.jpg
   │  │  │  ├─ img-14.jpg
   │  │  │  ├─ img-15.jpg
   │  │  │  ├─ img-16.jpg
   │  │  │  ├─ img-17.png
   │  │  │  ├─ img-2-dark.png
   │  │  │  ├─ img-2.png
   │  │  │  ├─ img-8.png
   │  │  │  ├─ img-9.png
   │  │  │  ├─ no-mail-selected-dark.png
   │  │  │  ├─ no-mail-selected.png
   │  │  │  ├─ no-notification.png
   │  │  │  ├─ pending-approval-dark.png
   │  │  │  ├─ pending-approval.png
   │  │  │  ├─ upload-dark.png
   │  │  │  ├─ upload.png
   │  │  │  ├─ welcome-dark.png
   │  │  │  └─ welcome.png
   │  │  ├─ products
   │  │  │  ├─ product-1-2.jpg
   │  │  │  ├─ product-1-3.jpg
   │  │  │  ├─ product-1-4.jpg
   │  │  │  ├─ product-1.jpg
   │  │  │  ├─ product-10.jpg
   │  │  │  ├─ product-11.jpg
   │  │  │  ├─ product-12.jpg
   │  │  │  ├─ product-2-2.jpg
   │  │  │  ├─ product-2.jpg
   │  │  │  ├─ product-3.jpg
   │  │  │  ├─ product-4.jpg
   │  │  │  ├─ product-5.jpg
   │  │  │  ├─ product-6.jpg
   │  │  │  ├─ product-7.jpg
   │  │  │  ├─ product-8.jpg
   │  │  │  └─ product-9.jpg
   │  │  └─ thumbs
   │  │     ├─ adobe-xd.png
   │  │     ├─ avalanche.png
   │  │     ├─ bitcoin-cash.png
   │  │     ├─ bitcoin-sv.png
   │  │     ├─ bitcoin.png
   │  │     ├─ cardano.png
   │  │     ├─ chainlink.png
   │  │     ├─ doge.png
   │  │     ├─ drivers-license-back-dark.png
   │  │     ├─ drivers-license-back.png
   │  │     ├─ drivers-license-front-dark.png
   │  │     ├─ drivers-license-front.png
   │  │     ├─ dropbox.png
   │  │     ├─ eos.png
   │  │     ├─ ethereum.png
   │  │     ├─ figma.png
   │  │     ├─ github.png
   │  │     ├─ gitlab.png
   │  │     ├─ google-drive.png
   │  │     ├─ help-center-category-0-dark.png
   │  │     ├─ help-center-category-0.png
   │  │     ├─ help-center-category-1-dark.png
   │  │     ├─ help-center-category-1.png
   │  │     ├─ help-center-category-2-dark.png
   │  │     ├─ help-center-category-2.png
   │  │     ├─ help-center-category-3-dark.png
   │  │     ├─ help-center-category-3.png
   │  │     ├─ help-center-category-4-dark.png
   │  │     ├─ help-center-category-4.png
   │  │     ├─ help-center-category-5-dark.png
   │  │     ├─ help-center-category-5.png
   │  │     ├─ help-center-category-6-dark.png
   │  │     ├─ help-center-category-6.png
   │  │     ├─ help-center-category-7-dark.png
   │  │     ├─ help-center-category-7.png
   │  │     ├─ hubspot.png
   │  │     ├─ id-card-back-dark.png
   │  │     ├─ id-card-back.png
   │  │     ├─ id-card-front-dark.png
   │  │     ├─ id-card-front.png
   │  │     ├─ jira.png
   │  │     ├─ layouts
   │  │     │  ├─ blank-dark.jpg
   │  │     │  ├─ blank.jpg
   │  │     │  ├─ classic-dark.jpg
   │  │     │  ├─ classic.jpg
   │  │     │  ├─ decked-dark.jpg
   │  │     │  ├─ decked.jpg
   │  │     │  ├─ modern-dark.jpg
   │  │     │  ├─ modern.jpg
   │  │     │  ├─ simple-dark.jpg
   │  │     │  ├─ simple.jpg
   │  │     │  ├─ stackedSide-dark.jpg
   │  │     │  └─ stackedSide.jpg
   │  │     ├─ litecoin.png
   │  │     ├─ miota.png
   │  │     ├─ monero.png
   │  │     ├─ notion.png
   │  │     ├─ passport-dark.png
   │  │     ├─ passport-data-dark.png
   │  │     ├─ passport-data.png
   │  │     ├─ passport.png
   │  │     ├─ polkadot.png
   │  │     ├─ polygon.png
   │  │     ├─ ripple.png
   │  │     ├─ saleforce-crm.png
   │  │     ├─ shiba-inu.png
   │  │     ├─ sketch.png
   │  │     ├─ slack.png
   │  │     ├─ solana.png
   │  │     ├─ stellar-lumens.png
   │  │     ├─ tether-us.png
   │  │     ├─ tron.png
   │  │     ├─ zapier.png
   │  │     └─ zendesk.png
   │  ├─ logo192.png
   │  ├─ logo512.png
   │  ├─ manifest.json
   │  └─ robots.txt
   ├─ safelist.txt
   ├─ src
   │  ├─ @types
   │  │  ├─ auth.ts
   │  │  ├─ chart.ts
   │  │  ├─ common.ts
   │  │  ├─ docs.ts
   │  │  ├─ navigation.ts
   │  │  ├─ routes.tsx
   │  │  └─ theme.ts
   │  ├─ App.tsx
   │  ├─ assets
   │  │  ├─ maps
   │  │  │  ├─ allstates.json
   │  │  │  ├─ continent_South_America_subunits.json
   │  │  │  ├─ us-albers.json
   │  │  │  └─ world-countries-sans-antarctica.json
   │  │  ├─ styles
   │  │  │  ├─ app.css
   │  │  │  ├─ components
   │  │  │  │  ├─ _alert.css
   │  │  │  │  ├─ _avatar.css
   │  │  │  │  ├─ _badge.css
   │  │  │  │  ├─ _button.css
   │  │  │  │  ├─ _card.css
   │  │  │  │  ├─ _checkbox.css
   │  │  │  │  ├─ _close-button.css
   │  │  │  │  ├─ _date-picker.css
   │  │  │  │  ├─ _dialog.css
   │  │  │  │  ├─ _drawer.css
   │  │  │  │  ├─ _dropdown.css
   │  │  │  │  ├─ _form.css
   │  │  │  │  ├─ _input-group.css
   │  │  │  │  ├─ _input.css
   │  │  │  │  ├─ _menu-item.css
   │  │  │  │  ├─ _menu.css
   │  │  │  │  ├─ _notification.css
   │  │  │  │  ├─ _pagination.css
   │  │  │  │  ├─ _progress.css
   │  │  │  │  ├─ _radio.css
   │  │  │  │  ├─ _segment.css
   │  │  │  │  ├─ _select.css
   │  │  │  │  ├─ _skeleton.css
   │  │  │  │  ├─ _steps.css
   │  │  │  │  ├─ _switcher.css
   │  │  │  │  ├─ _tables.css
   │  │  │  │  ├─ _tabs.css
   │  │  │  │  ├─ _tag.css
   │  │  │  │  ├─ _time-input.css
   │  │  │  │  ├─ _timeline.css
   │  │  │  │  ├─ _toast.css
   │  │  │  │  ├─ _tooltip.css
   │  │  │  │  ├─ _upload.css
   │  │  │  │  └─ index.css
   │  │  │  ├─ docs
   │  │  │  │  ├─ _docs.css
   │  │  │  │  └─ index.css
   │  │  │  ├─ tailwind
   │  │  │  │  └─ index.css
   │  │  │  ├─ template
   │  │  │  │  ├─ _header.css
   │  │  │  │  ├─ _secondary-header.css
   │  │  │  │  ├─ _side-nav.css
   │  │  │  │  ├─ _stacked-side-nav.css
   │  │  │  │  └─ index.css
   │  │  │  └─ vendors
   │  │  │     ├─ _apex-chart.css
   │  │  │     ├─ _full-calendar.css
   │  │  │     ├─ _react-quill.css
   │  │  │     └─ index.css
   │  │  └─ svg
   │  │     ├─ DriversLicenseSvg.tsx
   │  │     ├─ NationalIdSvg.tsx
   │  │     ├─ PassportSvg.tsx
   │  │     └─ index.ts
   │  ├─ components
   │  │  ├─ layouts
   │  │  │  ├─ AuthLayout
   │  │  │  │  ├─ AuthLayout.tsx
   │  │  │  │  ├─ Cover.tsx
   │  │  │  │  ├─ Side.tsx
   │  │  │  │  ├─ Simple.tsx
   │  │  │  │  └─ index.ts
   │  │  │  ├─ BlankLayout.tsx
   │  │  │  ├─ ClassicLayout.tsx
   │  │  │  ├─ DeckedLayout.tsx
   │  │  │  ├─ Layouts.tsx
   │  │  │  ├─ ModernLayout.tsx
   │  │  │  ├─ SimpleLayout.tsx
   │  │  │  ├─ StackedSideLayout.tsx
   │  │  │  └─ index.ts
   │  │  ├─ route
   │  │  │  ├─ AppRoute.tsx
   │  │  │  ├─ AuthorityGuard.tsx
   │  │  │  ├─ ProtectedRoute.tsx
   │  │  │  └─ PublicRoute.tsx
   │  │  ├─ shared
   │  │  │  ├─ ActionLink.tsx
   │  │  │  ├─ AdaptableCard.tsx
   │  │  │  ├─ Affix.tsx
   │  │  │  ├─ AuthorityCheck.tsx
   │  │  │  ├─ CalendarView.tsx
   │  │  │  ├─ Chart.tsx
   │  │  │  ├─ ConfirmDialog.tsx
   │  │  │  ├─ Container.tsx
   │  │  │  ├─ DataTable.tsx
   │  │  │  ├─ DoubleSidedImage.tsx
   │  │  │  ├─ EllipsisButton.tsx
   │  │  │  ├─ FormCustomFormatInput.tsx
   │  │  │  ├─ FormNumericInput.tsx
   │  │  │  ├─ FormPatternInput.tsx
   │  │  │  ├─ GrowShrinkTag.tsx
   │  │  │  ├─ IconText.tsx
   │  │  │  ├─ Loading.tsx
   │  │  │  ├─ NavToggle.tsx
   │  │  │  ├─ PasswordInput.tsx
   │  │  │  ├─ RegionMap.tsx
   │  │  │  ├─ RichTextEditor.tsx
   │  │  │  ├─ SegmentItemOption.tsx
   │  │  │  ├─ StickyFooter.tsx
   │  │  │  ├─ StrictModeDroppable.tsx
   │  │  │  ├─ SvgIcon.tsx
   │  │  │  ├─ SyntaxHighlighter.tsx
   │  │  │  ├─ TextEllipsis.tsx
   │  │  │  ├─ UsersAvatarGroup.tsx
   │  │  │  ├─ index.ts
   │  │  │  └─ loaders
   │  │  │     ├─ MediaSkeleton.tsx
   │  │  │     ├─ TableRowSkeleton.tsx
   │  │  │     └─ TextBlockSkeleton.tsx
   │  │  ├─ template
   │  │  │  ├─ Footer.tsx
   │  │  │  ├─ Header.tsx
   │  │  │  ├─ HeaderLogo.tsx
   │  │  │  ├─ HorizontalMenuContent
   │  │  │  │  ├─ HorizontalMenuContent.tsx
   │  │  │  │  ├─ HorizontalMenuDropdownItem.tsx
   │  │  │  │  ├─ HorizontalMenuItem.tsx
   │  │  │  │  ├─ HorizontalMenuNavLink.tsx
   │  │  │  │  └─ index.ts
   │  │  │  ├─ HorizontalNav.tsx
   │  │  │  ├─ LanguageSelector.tsx
   │  │  │  ├─ Logo.tsx
   │  │  │  ├─ MobileNav.tsx
   │  │  │  ├─ Notification.tsx
   │  │  │  ├─ PageContainer.tsx
   │  │  │  ├─ Search.tsx
   │  │  │  ├─ SecondaryHeader.tsx
   │  │  │  ├─ SideNav.tsx
   │  │  │  ├─ SideNavToggle.tsx
   │  │  │  ├─ SidePanel
   │  │  │  │  ├─ SidePanel.tsx
   │  │  │  │  ├─ SidePanelContent.tsx
   │  │  │  │  └─ index.ts
   │  │  │  ├─ StackedSideNav
   │  │  │  │  ├─ StackedSideNav.tsx
   │  │  │  │  ├─ StackedSideNavMini.tsx
   │  │  │  │  ├─ StackedSideNavSecondary.tsx
   │  │  │  │  └─ index.ts
   │  │  │  ├─ Theme.tsx
   │  │  │  ├─ ThemeConfigurator
   │  │  │  │  ├─ CopyButton.tsx
   │  │  │  │  ├─ DirectionSwitcher.tsx
   │  │  │  │  ├─ LayoutSwitcher.tsx
   │  │  │  │  ├─ ModeSwitcher.tsx
   │  │  │  │  ├─ NavModeSwitcher.tsx
   │  │  │  │  ├─ ThemeConfigurator.tsx
   │  │  │  │  ├─ ThemeSwitcher.tsx
   │  │  │  │  └─ index.ts
   │  │  │  ├─ UserDropdown.tsx
   │  │  │  └─ VerticalMenuContent
   │  │  │     ├─ VerticalCollapsedMenuItem.tsx
   │  │  │     ├─ VerticalMenuContent.tsx
   │  │  │     ├─ VerticalMenuIcon.tsx
   │  │  │     ├─ VerticalSingleMenuItem.tsx
   │  │  │     └─ index.ts
   │  │  └─ ui
   │  │     ├─ @types
   │  │     │  ├─ common.ts
   │  │     │  ├─ date.ts
   │  │     │  └─ placement.ts
   │  │     ├─ Alert
   │  │     │  ├─ Alert.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Avatar
   │  │     │  ├─ Avatar.tsx
   │  │     │  ├─ AvatarGroup.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Badge
   │  │     │  ├─ Badge.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Button
   │  │     │  ├─ Button.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Calendar
   │  │     │  └─ index.ts
   │  │     ├─ Card
   │  │     │  ├─ Card.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Checkbox
   │  │     │  ├─ Checkbox.tsx
   │  │     │  ├─ Group.tsx
   │  │     │  ├─ context.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ CloseButton
   │  │     │  ├─ CloseButton.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ ConfigProvider
   │  │     │  ├─ ConfigProvider.ts
   │  │     │  └─ index.ts
   │  │     ├─ DatePicker
   │  │     │  ├─ BasePicker.tsx
   │  │     │  ├─ Calendar.tsx
   │  │     │  ├─ CalendarBase.tsx
   │  │     │  ├─ DatePicker.tsx
   │  │     │  ├─ DatePickerRange.tsx
   │  │     │  ├─ DateTimepicker.tsx
   │  │     │  ├─ RangeCalendar.tsx
   │  │     │  ├─ index.tsx
   │  │     │  ├─ tables
   │  │     │  │  ├─ DateTable.tsx
   │  │     │  │  ├─ Header.tsx
   │  │     │  │  ├─ MonthTable.tsx
   │  │     │  │  ├─ YearTable.tsx
   │  │     │  │  └─ components
   │  │     │  │     ├─ Day.tsx
   │  │     │  │     ├─ Month.tsx
   │  │     │  │     ├─ props
   │  │     │  │     │  ├─ getDayProps.ts
   │  │     │  │     │  ├─ getRangeProps.ts
   │  │     │  │     │  ├─ isDisabled.ts
   │  │     │  │     │  ├─ isOutside.ts
   │  │     │  │     │  └─ isWeekend.ts
   │  │     │  │     └─ types.ts
   │  │     │  └─ utils
   │  │     │     ├─ formatYear.tsx
   │  │     │     ├─ getDecadeRange.ts
   │  │     │     ├─ getEndOfWeek.ts
   │  │     │     ├─ getMonthDays.ts
   │  │     │     ├─ getMonthsNames.ts
   │  │     │     ├─ getStartOfWeek.ts
   │  │     │     ├─ getWeekdaysNames.ts
   │  │     │     ├─ getYearsRange.ts
   │  │     │     ├─ index.ts
   │  │     │     ├─ isMonthInRange.ts
   │  │     │     ├─ isSameDate.ts
   │  │     │     └─ isSameMonth.ts
   │  │     ├─ Dialog
   │  │     │  ├─ Dialog.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Drawer
   │  │     │  ├─ Drawer.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Dropdown
   │  │     │  ├─ Dropdown.tsx
   │  │     │  ├─ DropdownInnerMenu.tsx
   │  │     │  ├─ DropdownItem.tsx
   │  │     │  ├─ DropdownMenu.tsx
   │  │     │  ├─ DropdownToggle.tsx
   │  │     │  ├─ context
   │  │     │  │  ├─ dropdownContext.ts
   │  │     │  │  ├─ dropdownMenuContext.ts
   │  │     │  │  └─ menuContext.ts
   │  │     │  └─ index.tsx
   │  │     ├─ Form
   │  │     │  ├─ FormContainer.tsx
   │  │     │  ├─ FormItem.tsx
   │  │     │  ├─ context.ts
   │  │     │  └─ index.tsx
   │  │     ├─ Input
   │  │     │  ├─ Input.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ InputGroup
   │  │     │  ├─ Addon.tsx
   │  │     │  ├─ InputGroup.tsx
   │  │     │  ├─ context.ts
   │  │     │  └─ index.tsx
   │  │     ├─ Menu
   │  │     │  ├─ Menu.tsx
   │  │     │  ├─ MenuCollapse.tsx
   │  │     │  ├─ MenuGroup.tsx
   │  │     │  ├─ MenuItem.tsx
   │  │     │  ├─ context
   │  │     │  │  ├─ collapseContext.tsx
   │  │     │  │  ├─ groupContext.tsx
   │  │     │  │  └─ menuContext.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ MenuItem
   │  │     │  └─ index.tsx
   │  │     ├─ Notification
   │  │     │  ├─ Notification.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Pagination
   │  │     │  ├─ Next.tsx
   │  │     │  ├─ Pagers.tsx
   │  │     │  ├─ Pagination.tsx
   │  │     │  ├─ Prev.tsx
   │  │     │  ├─ Total.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Progress
   │  │     │  ├─ Circle.tsx
   │  │     │  ├─ Line.tsx
   │  │     │  ├─ Progress.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Radio
   │  │     │  ├─ Group.tsx
   │  │     │  ├─ Radio.tsx
   │  │     │  ├─ context.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ RangeCalendar
   │  │     │  └─ index.ts
   │  │     ├─ ScrollBar
   │  │     │  ├─ ScrollBar.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Segment
   │  │     │  ├─ Segment.tsx
   │  │     │  ├─ SegmentItem.tsx
   │  │     │  ├─ context.ts
   │  │     │  └─ index.tsx
   │  │     ├─ Select
   │  │     │  ├─ Select.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Skeleton
   │  │     │  ├─ Skeleton.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Spinner
   │  │     │  ├─ Spinner.tsx
   │  │     │  └─ index.ts
   │  │     ├─ StatusIcon
   │  │     │  ├─ StatusIcon.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Steps
   │  │     │  ├─ StepItem.tsx
   │  │     │  ├─ Steps.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Switcher
   │  │     │  ├─ Switcher.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Table
   │  │     │  ├─ Sorter.tsx
   │  │     │  ├─ TBody.tsx
   │  │     │  ├─ TFoot.tsx
   │  │     │  ├─ THead.tsx
   │  │     │  ├─ Table.tsx
   │  │     │  ├─ Td.tsx
   │  │     │  ├─ Th.tsx
   │  │     │  ├─ Tr.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Tabs
   │  │     │  ├─ TabContent.tsx
   │  │     │  ├─ TabList.tsx
   │  │     │  ├─ TabNav.tsx
   │  │     │  ├─ Tabs.tsx
   │  │     │  ├─ context.ts
   │  │     │  └─ index.tsx
   │  │     ├─ Tag
   │  │     │  ├─ Tag.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ TimeInput
   │  │     │  ├─ AmPmInput.tsx
   │  │     │  ├─ TimeInput.tsx
   │  │     │  ├─ TimeInputField.tsx
   │  │     │  ├─ TimeInputRange.tsx
   │  │     │  ├─ index.tsx
   │  │     │  └─ utils
   │  │     │     ├─ clamp.ts
   │  │     │     ├─ createAmPmHandler.ts
   │  │     │     ├─ createTimeHandler.ts
   │  │     │     ├─ getDate.ts
   │  │     │     ├─ getTimeValues.ts
   │  │     │     ├─ index.ts
   │  │     │     └─ padTime.ts
   │  │     ├─ Timeline
   │  │     │  ├─ TimeLineItem.tsx
   │  │     │  ├─ Timeline.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Tooltip
   │  │     │  ├─ Arrow.tsx
   │  │     │  ├─ Tooltip.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ Upload
   │  │     │  ├─ FileItem.tsx
   │  │     │  ├─ Upload.tsx
   │  │     │  └─ index.tsx
   │  │     ├─ hooks
   │  │     │  ├─ index.ts
   │  │     │  ├─ useCallbackRef.ts
   │  │     │  ├─ useColorLevel.ts
   │  │     │  ├─ useControllableState.ts
   │  │     │  ├─ useDidUpdate.ts
   │  │     │  ├─ useMergeRef.ts
   │  │     │  ├─ useRootClose.ts
   │  │     │  ├─ useTimeout.ts
   │  │     │  ├─ useUncertainRef.ts
   │  │     │  ├─ useUniqueId.ts
   │  │     │  └─ useWindowSize.ts
   │  │     ├─ index.ts
   │  │     ├─ toast
   │  │     │  ├─ ToastWrapper.tsx
   │  │     │  ├─ index.ts
   │  │     │  ├─ toast.tsx
   │  │     │  └─ transition.ts
   │  │     └─ utils
   │  │        ├─ arrayIndexOf.ts
   │  │        ├─ capitalize.ts
   │  │        ├─ chainedFunction.ts
   │  │        ├─ constants.ts
   │  │        ├─ createUid.ts
   │  │        ├─ mapCloneElement.ts
   │  │        └─ shallowEqual.ts
   │  ├─ configs
   │  │  ├─ app.config.ts
   │  │  ├─ chart.config.ts
   │  │  ├─ navigation-icon.config.tsx
   │  │  ├─ navigation.config
   │  │  │  └─ index.ts
   │  │  ├─ routes.config
   │  │  │  ├─ authRoute.tsx
   │  │  │  ├─ index.ts
   │  │  │  └─ routes.config.ts
   │  │  └─ theme.config.ts
   │  ├─ constants
   │  │  ├─ api.constant.ts
   │  │  ├─ app.constant.ts
   │  │  ├─ chart.constant.ts
   │  │  ├─ countries.constant.ts
   │  │  ├─ navigation.constant.ts
   │  │  ├─ roles.constant.ts
   │  │  ├─ route.constant.ts
   │  │  └─ theme.constant.ts
   │  ├─ history.ts
   │  ├─ index.css
   │  ├─ locales
   │  │  ├─ index.ts
   │  │  ├─ lang
   │  │  │  └─ en.json
   │  │  └─ locales.ts
   │  ├─ main.tsx
   │  ├─ mock
   │  │  ├─ data
   │  │  │  └─ authData.ts
   │  │  ├─ fakeApi
   │  │  │  ├─ authFakeApi.ts
   │  │  │  └─ index.ts
   │  │  ├─ index.ts
   │  │  └─ mock.ts
   │  ├─ services
   │  │  ├─ ApiService.ts
   │  │  ├─ AuthService.ts
   │  │  ├─ BaseService.ts
   │  │  └─ RtkQueryService.ts
   │  ├─ store
   │  │  ├─ hook.ts
   │  │  ├─ index.ts
   │  │  ├─ rootReducer.ts
   │  │  ├─ slices
   │  │  │  ├─ auth
   │  │  │  │  ├─ constants.ts
   │  │  │  │  ├─ index.ts
   │  │  │  │  ├─ sessionSlice.ts
   │  │  │  │  └─ userSlice.ts
   │  │  │  ├─ base
   │  │  │  │  ├─ commonSlice.ts
   │  │  │  │  ├─ constants.ts
   │  │  │  │  └─ index.ts
   │  │  │  ├─ locale
   │  │  │  │  ├─ index.ts
   │  │  │  │  └─ localeSlice.ts
   │  │  │  └─ theme
   │  │  │     └─ themeSlice.ts
   │  │  └─ storeSetup.ts
   │  ├─ utils
   │  │  ├─ acronym.ts
   │  │  ├─ deepParseJson.ts
   │  │  ├─ growShrinkColor.ts
   │  │  ├─ hoc
   │  │  │  └─ withHeaderItem.tsx
   │  │  ├─ hooks
   │  │  │  ├─ useAuth.ts
   │  │  │  ├─ useAuthority.ts
   │  │  │  ├─ useDarkmode.ts
   │  │  │  ├─ useDirection.ts
   │  │  │  ├─ useLocale.ts
   │  │  │  ├─ useMenuActive.ts
   │  │  │  ├─ useQuery.ts
   │  │  │  ├─ useResponsive.ts
   │  │  │  ├─ useThemeClass.ts
   │  │  │  ├─ useTimeOutMessage.ts
   │  │  │  └─ useTwColorByName.ts
   │  │  ├─ isLastChild.ts
   │  │  ├─ paginate.ts
   │  │  ├─ requiredFieldValidation.ts
   │  │  ├─ shadeColor.ts
   │  │  ├─ sortBy.ts
   │  │  └─ wildCardSearch.ts
   │  ├─ views
   │  │  ├─ Home.tsx
   │  │  ├─ Views.tsx
   │  │  ├─ auth
   │  │  │  ├─ ForgotPassword
   │  │  │  │  ├─ ForgotPassword.tsx
   │  │  │  │  ├─ ForgotPasswordForm.tsx
   │  │  │  │  └─ index.tsx
   │  │  │  ├─ ResetPassword
   │  │  │  │  ├─ ResetPassword.tsx
   │  │  │  │  ├─ ResetPasswordForm.tsx
   │  │  │  │  └─ index.tsx
   │  │  │  ├─ SignIn
   │  │  │  │  ├─ SignIn.tsx
   │  │  │  │  ├─ SignInForm.tsx
   │  │  │  │  └─ index.ts
   │  │  │  └─ SignUp
   │  │  │     ├─ SignUp.tsx
   │  │  │     ├─ SignUpForm.tsx
   │  │  │     └─ index.ts
   │  │  ├─ demo
   │  │  │  ├─ CollapseMenuItemView1.tsx
   │  │  │  ├─ CollapseMenuItemView2.tsx
   │  │  │  ├─ GroupCollapseMenuItemView1.tsx
   │  │  │  ├─ GroupCollapseMenuItemView2.tsx
   │  │  │  ├─ GroupSingleMenuItemView.tsx
   │  │  │  └─ SingleMenuView.tsx
   │  │  └─ index.ts
   │  └─ vite-env.d.ts
   ├─ tailwind.config.cjs
   ├─ tsconfig.eslint.json
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   ├─ twSafelistGenerator
   │  ├─ generator.js
   │  └─ index.js
   └─ vite.config.ts

```