!define MUI_ABORTWARNING
!define MUI_ICON "about/1.png"
!define MUI_UNICON "about/IIAP-Logo.ico"

!macro BIENVENIDO_A_BIOSONIC
    ; Código del macro "BIENVENIDO_A_BIOSONIC" aquí
!macroend

!insertmacro BIENVENIDO_A_BIOSONIC
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!define MUI_FINISHPAGE_NOAUTOCLOSE
!define MUI_FINISHPAGE_RUN "TuApp.exe"
!insertmacro MUI_PAGE_FINISH

Section
    SetOutPath $INSTDIR
    File /r "electron\*.*"
SectionEnd
