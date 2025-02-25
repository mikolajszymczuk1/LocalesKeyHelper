export default {
  common: {
    logout: "Wyloguj",
    chat: "Czat",
    pieces: "szt.",
    switchUser: "Przełącz użytkownika",
    helpCenter: "Centrum pomocy",
    pageReload: "Odśwież stronę",
    errorMessage: {
      title: "Nieoczekiwany błąd",
      description:
        "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później lub skontaktuj się z Biurem Obsługi Klienta.<br><br>Kod błędu: {error}",
    },
    close: "Zamknij",
    cancel: "Anuluj",
    save: "Zapisz",
    superClose: "Super, zamknij",
    return: "Wróć",
    resign: "Rezygnuję",
    theme: "Motyw",
    colorTheme: "Motyw kolorystyczny",
    lightTheme: "Motyw jasny",
    darkTheme: "Motyw ciemny",
    light: "Jasny",
    dark: "Ciemny",
  },
  employee: {
    sidebarMenu: {
      reminders: "Powiadomienia",
      home: "Pulpit",
      order: "Zamówienia",
      account: "Ustawienia",
      regeneration: "Regeneracja",
      history: "Historia",
    },
    globalTranslation: {
      loadingChat: "Ładowanie czatu..",
    },
    dashboard: {
      deliveryPlace: "Zamówienie do",
      yourOrders: "Twoje zamówienia",
      makeOrder: "Zamów",
      currency: "zł",
      isCold: "Na zimno",
      noMenu: "Brak menu.",
      noMenuMessage: "Cierpliwości. Poczekaj aż Restaurator przygotuje menu, aby złożyć zamówienie",
      canNotOrder: "Upłynął czas składania zamówień w tym dniu",
      reusablePackages: {
        title: "Pojemniki wielorazowe",
        waitingForReturn: {
          label: "Oczekują na zwrot",
          description: "Opłata zostanie naliczona za {paymentDeadline} h",
        },
        returnedOverTime: {
          descriptionWithDeductions:
            "Opłata: <b>{deposit} {currency}</b> za niezwrócone pojemniki <b>zostanie pobrana</b> z Twojego wynagrodzenia na początku miesiąca.",
          descriptionWithDeductionsExtended:
            "Kolejny niezwrócony pojemnik spowoduje <b>utratę możliwości zamawiania z restauracji</b> biorących udział w programie.</br></br> Opłata: <b>{deposit} {currency}</b> za niezwrócone pojemniki <b>zostanie pobrana</b> z Twojego wynagrodzenia na początku miesiąca.",
          label: "Niezwrócone na czas",
          description: "Pamiętaj, że brak zwrotu 3 pojemników całkowicie uniemożliwi składanie zamówień.",
          warningInfo: "Następny niezwrócony pojemnik spowoduje <b>utratę możliwości zamawiania posiłków.</b>",
          maxLimitInfo:
            "<b>Osiągnięto limit</b> niezwróconych pojemników. <b>Skontaktuj się z Biurem Obsługi Klienta</b>, aby móc znów zamawiać.",
          errorDescriptionWithDeductions:
            "<b>Osiągnąłeś limit niezwróconych pojemników</b>, w tym okresie rozliczeniowym będziesz mógł składać zamówienia tylko w pojemnikach jednorazowych.</br></br> Opłata: <b>{deposit} {currency}</b> za niezwrócone pojemniki <b>zostanie pobrana</b> z Twojego wynagrodzenia na początku miesiąca.",
        },
        pieces: "{pieces} szt.",
        dialog: {
          title: "Pojemniki wielorazowe",
          summary: "Podsumowanie",
          returnedPackages: "Zwrócone pojemniki",
          endOfTimePeriod: "Koniec okresu rozliczeniowego",
          daysLeft: "{billingPeriod} dni",
          readMore: "Czytaj więcej o programie",
          ok: "OK, już wiem",
        },
      },
      moneyBox: {
        moneyBox: "Skarbonka",
        addFunds: "Doładuj",
        moneyBoxSummary: "Saldo {moneyBoxBalance}",
        maxLimit: " max limit",
        moneyBoxDescription:
          "Dodatkowa forma płatności, na którą możesz przelewać środki i przeznaczyć je na <b>płatności za posiłki w aplikacji SmartLunch.</b> <br /> <br /> Skarbonka pozwoli Ci lepiej <b>zarządzać pieniędzmi i kontrolować wydatki</b> na jedzenie.",
        okIKnow: "OK, już wiem",
      },
    }
  }
}
