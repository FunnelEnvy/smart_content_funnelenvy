<?php

namespace Drupal\smart_content_funnelenvy\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Plugin\Discovery\ContainerDeriverInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides condition plugin definitions for Funnelenvy fields.
 *
 * @see Drupal\smart_content_funnelenvy\Plugin\smart_content\Condition\FunnelenvyCondition
 */
class FunnelenvyConditionDeriver extends DeriverBase implements ContainerDeriverInterface {

  /**
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;


  /**
   * FunnelenvyConditionDeriver constructor.
   *
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   */
  public function __construct(MessengerInterface $messenger) {
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, $base_plugin_id) {
    return new static(
      $container->get('messenger')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    $this->derivatives = [];
    $funnelenvy_fields = $this->getStaticFields();
    ksort($funnelenvy_fields);
    foreach ($funnelenvy_fields as $key => $funnelenvy_field) {
      $this->derivatives[$key] = $funnelenvy_field + $base_plugin_definition;
    }
    return $this->derivatives;
  }


  /**
   * Function to return a static list of fields as defined in Funnelenvy's
   * firmographic attributes overview
   * (https://support.funnelenvy.com/hc/en-us/articles/203233110-Overview).
   *
   * @return array
   *   An array of fields from Funnelenvy.
   */
  protected function getStaticFields() {
    return [
      'variationSlug' => [
        'label' => 'Variation',
        'type'  => 'textfield',
        'unique' => true,
      ],
      'slug' => [
        'label' => 'Audience',
        'type'  => 'textfield',
        'unique' => true,
      ],
    ];
  }

  /**
   * Internal function used to map Funnelenvy data types to Smart Content
   * condition types.
   *
   * @param $type
   *
   * @return mixed
   */
  protected function mapType($type) {
    $map = [
      'string'  => 'textfield',
    ];
    return $map[strtolower($type)];
  }

}
